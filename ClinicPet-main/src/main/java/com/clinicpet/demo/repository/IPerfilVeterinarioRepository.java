package com.clinicpet.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.clinicpet.demo.model.PerfilVeterinario;
import com.clinicpet.demo.model.Usuario;

@Repository
public interface IPerfilVeterinarioRepository extends JpaRepository<PerfilVeterinario, Integer> {

	// Buscar perfil por ID de usuario
	Optional<PerfilVeterinario> findByUsuarioId(Integer usuarioId);

	// Buscar perfil por el objeto de usuario, correo y documento
	Optional<PerfilVeterinario> findByUsuario(Usuario usuario);

	Optional<PerfilVeterinario> findByUsuarioCorreo(String correo);

	Optional<PerfilVeterinario> findByUsuarioNumDocumento(String numDocumento);

	// Verificar existencia por email
	boolean existsByUsuarioCorreo(String correo);

	boolean existsByUsuarioNumDocumento(String numDocumento);
}