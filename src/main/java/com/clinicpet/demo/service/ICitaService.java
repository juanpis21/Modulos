package com.clinicpet.demo.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.clinicpet.demo.model.Cita;

@Service
public interface ICitaService {
//CRUD
	Cita guardarCita(Cita cita);

	List<Cita> listarCitas(Cita cita);

	Optional<Cita> buscarPorId(Integer id);

	void eliminarCita(Integer id);

	// METODOS PERSONALIZADOS

	// Buscar todas las citas de un usuario
	List<Cita> buscarPorUsuario(Integer usuarioId);

	// Buscar por un veterinario
	List<Cita> buscarPorVeterinario(Integer veterinarioId);

	// Buscar por un usuario en un rango de fechas
	List<Cita> buscarPorUsuarioYFechaRango(Integer usuarioId, LocalDateTime inicio, LocalDateTime fin);

	// Buscar por veterinario y rango de fechas
	List<Cita> buscarPorVeterinariaYFechaRango(Integer veterinarioId, LocalDateTime inicio, LocalDateTime fin);

}
