package com.clinicpet.demo.service;

import java.util.Optional;

import com.clinicpet.demo.model.PerfilVeterinario;
import com.clinicpet.demo.model.Usuario;

public interface IPerfilVeterinarioService {

	// Guardar/actualizar perfil
	PerfilVeterinario guardarPerfil(PerfilVeterinario perfil);

	// Buscar por ID
	Optional<PerfilVeterinario> buscarPorId(Integer id);

	// Buscar por ID de usuario
	Optional<PerfilVeterinario> buscarPorUsuarioId(Integer usuarioId);

	// Buscar por correo del usuario
	Optional<PerfilVeterinario> buscarPorUsuarioCorreo(String correo);

	// Buscar por documento del usuario
	Optional<PerfilVeterinario> buscarPorUsuarioNumDocumento(String numDocumento);

	// Actualizar información del perfil (sin afectar usuario)
	PerfilVeterinario actualizarPerfil(Integer id, PerfilVeterinario perfilActualizado);

	// Verificar existencia por correo
	boolean existePorUsuarioCorreo(String correo);

	// Verificar existencia por documento
	boolean existePorUsuarioNumDocumento(String numDocumento);

	PerfilVeterinario obtenerPerfilVeterinarioPorUsuario(Usuario usuarioLogueado);

	// Eliminar perfil veterinario y usuario asociado
	void eliminarPerfilYUsuario(Integer usuarioId);

}