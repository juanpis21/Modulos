package com.clinicpet.demo.service;

import com.clinicpet.demo.model.TokenRecuperacion;
import com.clinicpet.demo.model.Usuario;
import com.clinicpet.demo.repository.ITokenRecuperacionRepository;
import com.clinicpet.demo.repository.IUsuarioRepository;
import jakarta.mail.MessagingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetService {
    
    private static final Logger LOGGER = LoggerFactory.getLogger(PasswordResetService.class);

    @Autowired
    private IUsuarioRepository usuarioRepository;

    @Autowired
    private ITokenRecuperacionRepository tokenRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Transactional
    public String solicitarRecuperacion(String email) throws MessagingException {
        LOGGER.info("🔍 INICIO RECUPERACIÓN - Email recibido: {}", email);
        
        Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreo(email);
        
        if (usuarioOpt.isEmpty()) {
            LOGGER.warn("❌ EMAIL NO ENCONTRADO en BD: {}", email);
            return "No existe una cuenta con este correo electrónico";
        }
        
        LOGGER.info("✅ USUARIO ENCONTRADO en BD para email: {}", email);

        Usuario usuario = usuarioOpt.get();
        
        // Limpiar tokens anteriores del usuario
        tokenRepository.eliminarTokensByUsuario(usuario);
        
        // Generar nuevo token
        String token = UUID.randomUUID().toString();
        Date fechaExpiracion = new Date(System.currentTimeMillis() + 30 * 60 * 1000); // 30 minutos
        
        TokenRecuperacion tokenRecuperacion = new TokenRecuperacion();
        tokenRecuperacion.setUsuario(usuario);
        tokenRecuperacion.setToken(token);
        tokenRecuperacion.setFechaExpiracion(fechaExpiracion);
        
        tokenRepository.save(tokenRecuperacion);
        
        // Enviar correo
        String resetUrl = emailService.enviarCorreoRecuperacion(email, token, usuario.getNombres());
        
        if (resetUrl != null) {
            // Modo desarrollo: retornar mensaje con enlace
            return "✅ MODO DESARROLLO: Enlace de recuperación generado - " + resetUrl;
        }
        
        return "Se ha enviado un enlace de recuperación a tu correo electrónico";
    }

    public String validarToken(String token) {
        Optional<TokenRecuperacion> tokenOpt = tokenRepository.findTokenValido(token, new Date());
        
        if (tokenOpt.isEmpty()) {
            return "Token inválido o expirado";
        }
        
        return "Token válido";
    }

    @Transactional
    public String restablecerContrasena(String token, String nuevaContrasena) {
        Optional<TokenRecuperacion> tokenOpt = tokenRepository.findTokenValido(token, new Date());
        
        if (tokenOpt.isEmpty()) {
            return "Token inválido o expirado";
        }
        
        TokenRecuperacion tokenRecuperacion = tokenOpt.get();
        Usuario usuario = tokenRecuperacion.getUsuario();
        
        // Encriptar nueva contraseña
        String contrasenaEncriptada = passwordEncoder.encode(nuevaContrasena);
        usuario.setPassword(contrasenaEncriptada);
        
        usuarioRepository.save(usuario);
        
        // Eliminar token después de usarlo
        tokenRepository.eliminarByToken(token);
        
        return "Contraseña actualizada exitosamente";
    }

    public void limpiarTokensExpirados() {
        tokenRepository.eliminarTokensExpirados(new Date());
    }
}
