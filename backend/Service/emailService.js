const nodemailer = require('nodemailer');

// Configuración del transporte de correo usando Ethereal (para pruebas)
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Envía un correo electrónico de bienvenida al usuario
 * @param {string} email - Correo electrónico del destinatario
 * @param {string} nombre - Nombre del destinatario
 * @param {string} loginUrl - URL para acceder a la cuenta
 * @returns {Promise} - Resultado del envío
 */
async function enviarEmailBienvenida(email, nombre, loginUrl) {
    try {
        const info = await transporter.sendMail({
            from: `"Mawi - Soporte" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: '¡Bienvenido a Mawi!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #198754; text-align: center;">¡Bienvenido a Mawi!</h2>
                    <p>Hola ${nombre},</p>
                    <p>¡Gracias por registrarte en nuestra plataforma! Estamos emocionados de tenerte como parte de nuestra comunidad.</p>
                    <p>Con Mawi podrás:</p>
                    <ul>
                        <li>Participar en proyectos de biomonitorización</li>
                        <li>Explorar convocatorias disponibles</li>
                        <li>Colaborar con otros usuarios</li>
                    </ul>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${loginUrl}" style="background-color: #198754; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            Acceder a mi cuenta
                        </a>
                    </div>
                    <p>Si tienes alguna pregunta, no dudes en contactar a nuestro equipo de soporte.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} Mawi. Todos los derechos reservados.</p>
                </div>
            `
        });
        
        console.log("Correo de bienvenida enviado: %s", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Error al enviar correo de bienvenida:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Envía un correo electrónico con el enlace para recuperar contraseña
 * @param {string} email - Correo electrónico del destinatario
 * @param {string} nombre - Nombre del destinatario
 * @param {string} resetUrl - URL para restablecer la contraseña
 * @returns {Promise} - Resultado del envío
 */
async function enviarEmailRecuperacion(email, nombre, token) {
    const resetUrl = `http://localhost:5000/awaq/changepwd?token=${token}`;
    console.log(resetUrl);
    try {
        const info = await transporter.sendMail({
            from: `"Mawi - Soporte" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Recuperación de contraseña - Mawi',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #198754; text-align: center;">Recuperación de contraseña</h2>
                    <p>Hola ${nombre},</p>
                    <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en Mawi.</p>
                    <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background-color: #198754; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            Restablecer contraseña
                        </a>
                    </div>
                    <p>Este enlace expirará en 1 hora por motivos de seguridad.</p>
                    <p>Si no solicitaste restablecer tu contraseña, puedes ignorar este mensaje.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} Mawi. Todos los derechos reservados.</p>
                </div>
            `
        });
        
        console.log("Correo de recuperación enviado: %s", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Error al enviar correo de recuperación:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Envía un correo informativo a direcciones no registradas
 * @param {string} email - Correo electrónico del destinatario
 * @returns {Promise} - Resultado del envío
 */
async function enviarEmailNoRegistrado(email) {
    try {
        const info = await transporter.sendMail({
            from: `"Mawi - Soporte" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Solicitud de recuperación de contraseña - Mawi',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #198754; text-align: center;">Solicitud de recuperación de contraseña</h2>
                    <p>Hola,</p>
                    <p>Hemos recibido una solicitud para restablecer la contraseña de una cuenta asociada a esta dirección de correo electrónico.</p>
                    <p><strong>Sin embargo, no encontramos ninguna cuenta registrada con este correo en nuestra plataforma Mawi.</strong></p>
                    <div style="background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 15px; margin: 20px 0;">
                        <h4 style="color: #495057; margin-top: 0;">¿Qué puedes hacer?</h4>
                        <ul style="color: #6c757d; margin-bottom: 0;">
                            <li>Verifica que hayas ingresado el correo correcto</li>
                            <li>Si aún no tienes una cuenta, puedes registrarte en nuestra plataforma</li>
                            <li>Si crees que esto es un error, contacta con nuestro equipo de soporte</li>
                        </ul>
                    </div>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="http://localhost:4000/awaq/registro" style="background-color: #198754; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-right: 10px;">
                            Crear cuenta
                        </a>
                        <a href="http://localhost:4000/awaq/login" style="background-color: #6c757d; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            Iniciar sesión
                        </a>
                    </div>
                    <p>Si no solicitaste esta recuperación de contraseña, puedes ignorar este mensaje de forma segura.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} Mawi. Todos los derechos reservados.</p>
                </div>
            `
        });
        
        console.log("Correo informativo enviado: %s", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Error al enviar correo informativo:", error);
        return { success: false, error: error.message };
    }
}

// Exportar funciones para usarlas
module.exports = {
    enviarEmailBienvenida,
    enviarEmailRecuperacion,
    enviarEmailNoRegistrado
};

