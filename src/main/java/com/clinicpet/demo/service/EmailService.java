package com.clinicpet.demo.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger LOGGER = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.email.dev-mode:false}")
    private boolean devMode;

    public String enviarCorreoRecuperacion(String toEmail, String token, String nombres) throws MessagingException {
        LOGGER.info("📧 Iniciando envío de correo de recuperación");
        LOGGER.info("📧 Para: {}", toEmail);
        LOGGER.info("📧 Desde: {}", fromEmail);
        LOGGER.info("📧 Token: {}", token.substring(0, 8) + "...");
        
        String resetUrl = "http://localhost:52908/usuarios/recovery-contra?token=" + token;
        
        // Modo desarrollo: mostrar enlace en consola y retornarlo
        if (devMode) {
            LOGGER.info("🔧 MODO DESARROLLO: Correo no enviado - Enlace de recuperación:");
            LOGGER.info("🔗 {}", resetUrl);
            LOGGER.info("🔧 Copia y pega este enlace en tu navegador para probar la recuperación");
            return resetUrl; // Retornar el enlace para uso en desarrollo
        }
        
        LOGGER.info("📧 MODO PRODUCCIÓN: Enviando correo real a {}", toEmail);
        
        // Modo producción: enviar correo real
        try {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        
        helper.setFrom(fromEmail);
        helper.setTo(toEmail);
        helper.setSubject("Recuperación de Contraseña - HelpYourPet");
        
        String htmlContent = buildEmailTemplate(nombres, resetUrl);
        helper.setText(htmlContent, true);
        
        LOGGER.info("📧 Enviando correo a través de SMTP...");
        mailSender.send(message);
        LOGGER.info("✅ Correo enviado exitosamente a {}", toEmail);
        
        } catch (MessagingException e) {
            LOGGER.error("❌ Error al enviar correo de recuperación a {}: {}", toEmail, e.getMessage());
            LOGGER.error("❌ Detalles del error SMTP:", e);
            throw e;
        } catch (Exception e) {
            LOGGER.error("❌ Error inesperado al enviar correo a {}: {}", toEmail, e.getMessage());
            LOGGER.error("❌ Detalles del error:", e);
            throw new MessagingException("Error inesperado al enviar correo: " + e.getMessage(), e);
        }
        
        return null; // En producción no retornamos el enlace
    }

    private String buildEmailTemplate(String nombres, String resetUrl) {
        return "<!DOCTYPE html>" +
                "<html lang=\"es\">" +
                "<head>" +
                "    <meta charset=\"UTF-8\">" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
                "    <title>Recuperación de Contraseña</title>" +
                "    <style>" +
                "        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }" +
                "        .container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                "        .header { background-color: #236c9c; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }" +
                "        .header h1 { color: white; margin: 0; font-size: 28px; }" +
                "        .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }" +
                "        .button { display: inline-block; background-color: #236c9c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; font-weight: bold; }" +
                "        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }" +
                "        .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }" +
                "    </style>" +
                "</head>" +
                "<body>" +
                "    <div class=\"container\">" +
                "        <div class=\"header\">" +
                "            <h1>🐾 HelpYourPet</h1>" +
                "        </div>" +
                "        <div class=\"content\">" +
                "            <h2>Recuperación de Contraseña</h2>" +
                "            <p>¡Hola " + nombres + "!</p>" +
                "            <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en HelpYourPet.</p>" +
                "            <p>Para continuar con el proceso de recuperación, haz clic en el siguiente botón:</p>" +
                "            <div style=\"text-align: center;\">" +
                "                <a href=\"" + resetUrl + "\" class=\"button\">Restablecer Contraseña</a>" +
                "            </div>" +
                "            <div class=\"warning\">" +
                "                <strong>⚠️ Importante:</strong> Este enlace expirará en 30 minutos por razones de seguridad. Si no solicitaste este cambio, puedes ignorar este correo." +
                "            </div>" +
                "            <p>Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:</p>" +
                "            <p style=\"word-break: break-all; background-color: #e9ecef; padding: 10px; border-radius: 5px;\">" + resetUrl + "</p>" +
                "        </div>" +
                "        <div class=\"footer\">" +
                "            <p>© 2024 HelpYourPet - Todos los derechos reservados</p>" +
                "            <p>Este es un correo automático, por favor no respondas a este mensaje.</p>" +
                "        </div>" +
                "    </div>" +
                "</body>" +
                "</html>";
    }
}
