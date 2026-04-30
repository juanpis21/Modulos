package com.clinicpet.demo.service;

import com.clinicpet.demo.model.PerfilAdmin;
import com.clinicpet.demo.repository.IPerfilAdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PerfilAdminServiceImplement implements IPerfilAdminService {

	@Autowired
	private IPerfilAdminRepository perfilAdminRepository;

	@Override
	public List<PerfilAdmin> listarTodos() {
		return perfilAdminRepository.findAll();
	}

	@Override
	public Optional<PerfilAdmin> buscarPorId(Integer id) {
		return perfilAdminRepository.findById(id);
	}

	@Override
	public PerfilAdmin guardar(PerfilAdmin perfilAdmin) {
		return perfilAdminRepository.save(perfilAdmin);
	}

	@Override
	public void eliminar(Integer id) {
		perfilAdminRepository.deleteById(id);
	}

	@Override
	public PerfilAdmin buscarPorCorreo(String correo) {
		return perfilAdminRepository.findByCorreo(correo);
	}

	@Override
	public boolean activarUsuario(Integer usuarioId) {
		System.out.println("Activando usuario ID: " + usuarioId);
		return true;
	}

	@Override
	public boolean desactivarUsuario(Integer usuarioId) {
		System.out.println("Desactivando usuario ID: " + usuarioId);
		return true;
	}

	@Override
	public boolean validarCalificacion(Integer calificacionId) {
		System.out.println("Validando calificación ID: " + calificacionId);
		return true;
	}

	@Override
	public boolean asignarReporteMaltrato(Integer reporteId) {
		System.out.println("Asignando reporte de maltrato ID: " + reporteId);
		return true;
	}

	@Override
	public long contarTotalAdmins() {
		return perfilAdminRepository.count();
	}

	@Override
	public long contarUsuariosActivos() {
		return 150L;
	}

	@Override
	public Optional<PerfilAdmin> buscarPorUsuarioId(Integer usuarioId) {
		return perfilAdminRepository.findByUsuarioId(usuarioId);
	}

	@Override
	public long contarMascotasRegistradas() {
		return 300L;
	}

	// metodo para contar veterinarias activas
	public long contarVeterinariasActivas() {
		// Conectar con servicio de veterinarias
		return 87L;
	}
}