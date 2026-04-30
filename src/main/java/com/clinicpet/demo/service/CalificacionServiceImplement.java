package com.clinicpet.demo.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clinicpet.demo.model.Calificacion;
import com.clinicpet.demo.repository.ICalificacionRepository;

@Service
public class CalificacionServiceImplement implements ICalificacionService {
	@Autowired
	private ICalificacionRepository calificacionRepository;

	// CRUD
	public Calificacion guardarCalificacion(Calificacion calificacion) {
		return calificacionRepository.save(calificacion);
	}

	public List<Calificacion> listarCalificaciones() {
		return calificacionRepository.findAll();
	}

	public Optional<Calificacion> buscarPorId(Integer id) {
		return calificacionRepository.findById(id);
	}

	public void eliminarCalificacion(Integer id) {
		calificacionRepository.deleteById(id);
	}

	// METODOS PERSONALIZADOS
	// buscar por usuario
	@Override
	public List<Calificacion> BuscarPorUsuario(Integer usuarioId) {
		return calificacionRepository.findByUsuario_Id(usuarioId);

	}

	// buscar por veterinario
	@Override
	public List<Calificacion> BuscarPorVeterinario(Integer veterinarioId) {
		return calificacionRepository.findByVeterinario_Id(veterinarioId);
	}

	// buscar por servicio
	@Override
	public List<Calificacion> BuscarPorServicio(Integer servicioId) {
		return calificacionRepository.findByServicio_Id(servicioId);
	}

	@Override
	public List<Calificacion> BuscarPorFecha(LocalDate fecha) {
		return calificacionRepository.findByFecha(fecha);
	}

}
