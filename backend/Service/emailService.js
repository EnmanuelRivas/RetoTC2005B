const nodemailer = require('nodemailer');
require('dotenv').config();

// Configuración del transporter de nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // O el servicio que prefieras
    auth: {
        user: process.env.EMAIL_USER || 'tu-correo@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'tu-contraseña-de-app'
    }
});

/**
 * Envía un correo electrónico para recuperar la contraseña
 * @param {string} email - Correo electrónico del destinatario
 * @param {string} token - Token de recuperación
 * @returns {Promise} - Promesa con el resultado del envío
 */
async function enviarCorreoRecuperacion(email, token) {
    try {
        const resetUrl = `http://localhost:4000/awaq/changepwd?token=${token}`;
        
        const mailOptions = {
            from: process.env.EMAIL_USER || 'tu-correo@gmail.com',
            to: email,
            subject: 'Recuperación de contraseña - Mawi',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #198754; text-align: center;">Recuperación de contraseña</h2>
                    <p>Has solicitado restablecer tu contraseña en la plataforma Mawi.</p>
                    <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background-color: #198754; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            Restablecer contraseña
                        </a>
                    </div>
                    <p>Si no solicitaste este cambio, puedes ignorar este correo y tu contraseña seguirá siendo la misma.</p>
                    <p>Este enlace expirará en 1 hora por motivos de seguridad.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} Mawi. Todos los derechos reservados.</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        return {
            success: true,
            messageId: info.messageId
        };
    } catch (error) {
        console.error('Error al enviar correo de recuperación:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

module.exports = {
    enviarCorreoRecuperacion
}; 