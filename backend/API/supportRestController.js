/**
 * Controlador REST para el sistema de soporte
 */

const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');

class SupportRestController {
    constructor() {
        this.setupEmailTransporter();
    }    setupEmailTransporter() {
        // Configurar transporter de email (ajustar según tu proveedor)
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER || 'awaq.soporte@gmail.com',
                pass: process.env.EMAIL_PASSWORD || 'your-app-password'
            }
        });
    }

    /**
     * POST /api/support/ticket - Crear nueva solicitud de soporte
     */
    async createSupportTicket(req, res) {
        try {
            const {
                name,
                email,
                category,
                priority,
                subject,
                message,
                browserInfo,
                timestamp,
                userId
            } = req.body;

            // Validar datos requeridos
            if (!name || !email || !category || !subject || !message) {
                return res.status(400).json({
                    success: false,
                    message: 'Faltan datos requeridos'
                });
            }

            // Generar ID único para el ticket
            const ticketId = this.generateTicketId();

            // Crear objeto del ticket
            const ticket = {
                id: ticketId,
                name,
                email,
                category,
                priority: priority || 'media',
                subject,
                message,
                browserInfo,
                timestamp: timestamp || new Date().toISOString(),
                userId: userId || null,
                status: 'abierto',
                responses: []
            };

            // Guardar ticket en archivo JSON (puedes cambiar a base de datos)
            await this.saveTicket(ticket);

            // Enviar email de confirmación al usuario
            await this.sendConfirmationEmail(ticket);

            // Enviar email al equipo de soporte
            await this.sendSupportNotification(ticket);

            res.status(201).json({
                success: true,
                message: 'Solicitud de soporte creada exitosamente',
                ticketId: ticketId
            });

        } catch (error) {
            console.error('Error creando ticket de soporte:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }    /**
     * GET /api/support/tickets - Obtener tickets (solo admin)
     */
    async getSupportTickets(req, res) {
        try {
            const tickets = await this.loadAllTickets();
            
            res.json({
                success: true,
                tickets: tickets
            });

        } catch (error) {
            console.error('Error obteniendo tickets:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }    /**
     * GET /api/support/ticket/:id - Obtener ticket específico
     */
    async getSupportTicket(req, res) {
        try {
            const { id } = req.params;
            const ticket = await this.loadTicket(id);

            if (!ticket) {
                return res.status(404).json({
                    success: false,
                    message: 'Ticket no encontrado'
                });
            }

            res.json({
                success: true,
                ticket: ticket
            });

        } catch (error) {
            console.error('Error obteniendo ticket:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }    /**
     * PUT /api/support/ticket/:id/response - Responder a un ticket (solo admin)
     */
    async respondToTicket(req, res) {
        try {
            const { id } = req.params;
            const { response, status } = req.body;

            if (!response) {
                return res.status(400).json({
                    success: false,
                    message: 'La respuesta es requerida'
                });
            }

            const ticket = await this.loadTicket(id);
            if (!ticket) {
                return res.status(404).json({
                    success: false,
                    message: 'Ticket no encontrado'
                });
            }

            // Agregar respuesta al ticket
            ticket.responses.push({
                adminId: req.user ? req.user.id : 'admin',
                adminName: req.user ? req.user.username : 'Administrador',
                response: response,
                timestamp: new Date().toISOString()
            });

            // Actualizar status si se proporciona
            if (status) {
                ticket.status = status;
            }

            // Guardar ticket actualizado
            await this.saveTicket(ticket);

            // Enviar email al usuario con la respuesta
            await this.sendResponseEmail(ticket, response);

            res.json({
                success: true,
                message: 'Respuesta enviada exitosamente'
            });

        } catch (error) {
            console.error('Error respondiendo ticket:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }

    // Métodos auxiliares

    generateTicketId() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `AWAQ-${timestamp}-${random}`;
    }

    async saveTicket(ticket) {
        const ticketsDir = path.join(__dirname, '../Data/support_tickets');
        
        // Crear directorio si no existe
        try {
            await fs.access(ticketsDir);
        } catch {
            await fs.mkdir(ticketsDir, { recursive: true });
        }

        const filePath = path.join(ticketsDir, `${ticket.id}.json`);
        await fs.writeFile(filePath, JSON.stringify(ticket, null, 2));
    }

    async loadTicket(ticketId) {
        try {
            const filePath = path.join(__dirname, '../Data/support_tickets', `${ticketId}.json`);
            const data = await fs.readFile(filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return null;
        }
    }

    async loadAllTickets() {
        try {
            const ticketsDir = path.join(__dirname, '../Data/support_tickets');
            const files = await fs.readdir(ticketsDir);
            const tickets = [];

            for (const file of files) {
                if (file.endsWith('.json')) {
                    const filePath = path.join(ticketsDir, file);
                    const data = await fs.readFile(filePath, 'utf8');
                    tickets.push(JSON.parse(data));
                }
            }

            // Ordenar por timestamp (más reciente primero)
            return tickets.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        } catch (error) {
            console.error('Error cargando tickets:', error);
            return [];
        }
    }

    async sendConfirmationEmail(ticket) {
        const mailOptions = {
            from: process.env.EMAIL_USER || 'awaq.soporte@gmail.com',
            to: ticket.email,
            subject: `[AWAQ] Confirmación de solicitud de soporte - Ticket #${ticket.id}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #28a745;">AWAQ - Solicitud de Soporte Recibida</h2>
                    
                    <p>Hola ${ticket.name},</p>
                    
                    <p>Hemos recibido tu solicitud de soporte y nuestro equipo la revisará en breve.</p>
                    
                    <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0;">
                        <h3>Detalles de tu solicitud:</h3>
                        <p><strong>Ticket #:</strong> ${ticket.id}</p>
                        <p><strong>Categoría:</strong> ${ticket.category}</p>
                        <p><strong>Prioridad:</strong> ${ticket.priority}</p>
                        <p><strong>Asunto:</strong> ${ticket.subject}</p>
                        <p><strong>Fecha:</strong> ${new Date(ticket.timestamp).toLocaleString('es-ES')}</p>
                    </div>
                    
                    <p>Tiempo estimado de respuesta: <strong>24-48 horas</strong></p>
                    
                    <p>Gracias por usar AWAQ.</p>
                    
                    <hr>
                    <p style="font-size: 12px; color: #666;">
                        Este es un email automático, por favor no respondas a este mensaje.
                    </p>
                </div>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Email de confirmación enviado a ${ticket.email}`);
        } catch (error) {
            console.error('Error enviando email de confirmación:', error);
        }
    }

    async sendSupportNotification(ticket) {
        const supportEmail = process.env.SUPPORT_EMAIL || 'soporte@awaq.com';
        
        const mailOptions = {
            from: process.env.EMAIL_USER || 'awaq.soporte@gmail.com',
            to: supportEmail,
            subject: `[AWAQ] Nueva solicitud de soporte - ${ticket.category} - ${ticket.priority}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px;">
                    <h2 style="color: #dc3545;">Nueva Solicitud de Soporte</h2>
                    
                    <div style="background-color: #f8f9fa; padding: 15px; border: 1px solid #dee2e6; margin: 20px 0;">
                        <h3>Información del Usuario:</h3>
                        <p><strong>Nombre:</strong> ${ticket.name}</p>
                        <p><strong>Email:</strong> ${ticket.email}</p>
                        <p><strong>User ID:</strong> ${ticket.userId || 'N/A'}</p>
                    </div>
                    
                    <div style="background-color: #fff3cd; padding: 15px; border: 1px solid #ffeaa7; margin: 20px 0;">
                        <h3>Detalles del Ticket:</h3>
                        <p><strong>Ticket #:</strong> ${ticket.id}</p>
                        <p><strong>Categoría:</strong> ${ticket.category}</p>
                        <p><strong>Prioridad:</strong> <span style="color: ${this.getPriorityColor(ticket.priority)}">${ticket.priority.toUpperCase()}</span></p>
                        <p><strong>Asunto:</strong> ${ticket.subject}</p>
                        <p><strong>Fecha:</strong> ${new Date(ticket.timestamp).toLocaleString('es-ES')}</p>
                    </div>
                    
                    <div style="background-color: #f8f9fa; padding: 15px; border: 1px solid #dee2e6; margin: 20px 0;">
                        <h3>Mensaje:</h3>
                        <p style="white-space: pre-wrap;">${ticket.message}</p>
                    </div>
                    
                    <div style="background-color: #e9ecef; padding: 10px; font-size: 12px;">
                        <p><strong>Información del navegador:</strong></p>
                        <p style="word-break: break-all;">${ticket.browserInfo}</p>
                    </div>
                </div>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Notificación de soporte enviada para ticket ${ticket.id}`);
        } catch (error) {
            console.error('Error enviando notificación de soporte:', error);
        }
    }

    async sendResponseEmail(ticket, response) {
        const mailOptions = {
            from: process.env.EMAIL_USER || 'awaq.soporte@gmail.com',
            to: ticket.email,
            subject: `[AWAQ] Respuesta a tu solicitud de soporte - Ticket #${ticket.id}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #28a745;">AWAQ - Respuesta del Equipo de Soporte</h2>
                    
                    <p>Hola ${ticket.name},</p>
                    
                    <p>Hemos respondido a tu solicitud de soporte:</p>
                    
                    <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0;">
                        <p><strong>Ticket #:</strong> ${ticket.id}</p>
                        <p><strong>Asunto:</strong> ${ticket.subject}</p>
                    </div>
                    
                    <div style="background-color: #ffffff; padding: 20px; border: 1px solid #dee2e6; margin: 20px 0;">
                        <h3>Respuesta del equipo:</h3>
                        <p style="white-space: pre-wrap;">${response}</p>
                    </div>
                    
                    <p>Si necesitas asistencia adicional, puedes responder a este email o crear una nueva solicitud desde la plataforma.</p>
                    
                    <p>Gracias por usar AWAQ.</p>
                    
                    <hr>
                    <p style="font-size: 12px; color: #666;">
                        Equipo de Soporte AWAQ
                    </p>
                </div>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Respuesta enviada por email para ticket ${ticket.id}`);
        } catch (error) {
            console.error('Error enviando respuesta por email:', error);
        }
    }

    getPriorityColor(priority) {
        const colors = {
            'baja': '#28a745',
            'media': '#ffc107',
            'alta': '#fd7e14',
            'urgente': '#dc3545'
        };
        return colors[priority] || '#6c757d';
    }
}

module.exports = new SupportRestController();
