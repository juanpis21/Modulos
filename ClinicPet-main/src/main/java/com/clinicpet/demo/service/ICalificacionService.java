package com.clinicpet.demo.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.clinicpet.demo.model.Calificacion;

public interface ICalificacionService {

	// CRUD

	Calificacion guardarCalificacion(Calificacion calificacion);

	List<Calificacion> listarCalificaciones();

	Optional<Calificacion> buscarPorId(Integer id);

	void eliminarCalificacion(Integer Id);

	// METODOS PERSONALIZADOS

	List<Calificacion> BuscarPorUsuario(Integer usuarioId);

	List<Calificacion> BuscarPorVeterinario(Integer veterinarioId);

	List<Calificacion> BuscarPorServicio(Integer servicioId);

	List<Calificacion> BuscarPorFecha(LocalDate fecha);

}
