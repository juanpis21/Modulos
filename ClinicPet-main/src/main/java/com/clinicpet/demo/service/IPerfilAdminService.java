package com.clinicpet.demo.service;

import com.clinicpet.demo.model.PerfilAdmin;
import java.util.List;
import java.util.Optional;

public interface IPerfilAdminService {

	// CRUD
	List<PerfilAdmin> listarTodos();

	Optional<PerfilAdmin> buscarPorId(Integer id);

	Optional<PerfilAdmin> buscarPorUsuarioId(Integer usuarioId);

	PerfilAdmin guardar(PerfilAdmin Admin);

	void eliminar(Integer id);

	// busqueda
	PerfilAdmin buscarPorCorreo(String correo);

	// funcionalidades del administrador
	boolean activarUsuario(Integer usuarioId);

	boolean desactivarUsuario(Integer usuarioId);

	boolean validarCalificacion(Integer calificacionId);

	boolean asignarReporteMaltrato(Integer reporteId);

	// estadísticas
	long contarTotalAdmins();

	long contarUsuariosActivos();

	long contarMascotasRegistradas();
}