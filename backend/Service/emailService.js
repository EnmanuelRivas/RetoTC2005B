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
    const resetUrl = `http://localhost:4000/awaq/changepwd?token=${token}`;
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
        return { success: true, messageId: info.messageId };    } catch (error) {
        console.error("Error al enviar correo de recuperación:", error);
        return { success: false, error: error.message };
    }
}

// Exportar funciones para usarlas
module.exports = {
    enviarEmailBienvenida,
    enviarEmailRecuperacion
};

