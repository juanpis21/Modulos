package com.clinicpet.demo.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.clinicpet.demo.model.Evento;
import com.clinicpet.demo.repository.IEventoRepository;

@Service
public class EventoServiceImplement implements IEventoService {

	@Autowired
	private IEventoRepository eventoRepository;

	@Override
	public Evento guardarEvento(Evento evento) {
		// TODO Auto-generated method stub
		validarEvento(evento);
		return eventoRepository.save(evento);
	}

	@Override
	public List<Evento> obtenerTodosLosEventos() {
		// TODO Auto-generated method stub
		return eventoRepository.findAll();
	}

	@Override
	public Optional<Evento> obtenerEventoPorId(Integer id) {
		// TODO Auto-generated method stub
		return eventoRepository.findById(id);
	}

	@Override
	public void eliminarEvento(Integer id) {
		// TODO Auto-generated method stub
		if (!eventoRepository.existsById(id)) {
			throw new IllegalArgumentException("No existe un evento con el ID: " + id);
		}
		eventoRepository.deleteById(id);
	}

	@Override
	public List<Evento> obtenerEventosVigentes() {
		// TODO Auto-generated method stub
		LocalDate hoy = LocalDate.now();
		return eventoRepository.findByFechafinAfter(hoy);
	}

	// Método para validaciones
	private void validarEvento(Evento evento) {
		if (evento.getTitulo() == null || evento.getTitulo().trim().isEmpty()) {
			throw new IllegalArgumentException("El título del evento es obligatorio");
		}

		if (evento.getDescripcion() == null || evento.getDescripcion().trim().isEmpty()) {
			throw new IllegalArgumentException("La descripción del evento es obligatoria");
		}

		if (evento.getFechainicio() == null) {
			throw new IllegalArgumentException("La fecha de inicio es obligatoria");
		}

		if (evento.getFechafin() == null) {
			throw new IllegalArgumentException("La fecha de fin es obligatoria");
		}

		if (evento.getVeterinaria() == null) {
			throw new IllegalArgumentException("La veterinaria es obligatoria");
		}

		// Validar que la fecha de fin no sea anterior a la fecha de inicio
		if (evento.getFechafin().isBefore(evento.getFechainicio())) {
			throw new IllegalArgumentException("La fecha de fin no puede ser anterior a la fecha de inicio");
		}

		// Validar que la fecha de fin no sea anterior a hoy
		if (evento.getFechafin().isBefore(LocalDate.now())) {
			throw new IllegalArgumentException("La fecha de fin no puede ser anterior a hoy");
		}

		// Validar longitud máxima del título (opcional)
		if (evento.getTitulo().length() > 100) {
			throw new IllegalArgumentException("El título no puede exceder los 100 caracteres");
		}
	}

	@Override
	public void guardarEvento(String titulo, String descripcion, String fechaInicio, String fechaFin,
			MultipartFile imagen, Integer id) {
		// TODO Auto-generated method stub
		
	}

}
