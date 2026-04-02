package com.clinicpet.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import com.clinicpet.demo.model.Evento;

public interface IEventoService {

	// Guardar/actualizar un evento
	public Evento guardarEvento(Evento evento);

	// Obtener todos los eventos
	public List<Evento> obtenerTodosLosEventos();

	// Obtener un evento por ID
	public Optional<Evento> obtenerEventoPorId(Integer id);

	// Eliminar un evento por ID
	public void eliminarEvento(Integer id);

	// Obtener eventos vigentes (no han terminado)
	public List<Evento> obtenerEventosVigentes();

	public void guardarEvento(String titulo, String descripcion, String fechaInicio, String fechaFin,
			MultipartFile imagen, Integer id);
}
