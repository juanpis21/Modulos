package com.clinicpet.demo.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clinicpet.demo.model.Cita;
import com.clinicpet.demo.repository.ICitaRepository;

@Service
public class CitaServiceImplement implements ICitaService {

	@Autowired
	private ICitaRepository citaRepository;

	@Override
	public Cita guardarCita(Cita cita) {
		return citaRepository.save(cita);
	}

	@Override
	public List<Cita> listarCitas(Cita cita) {
		return citaRepository.findAll();
	}

	@Override
	public Optional<Cita> buscarPorId(Integer id) {
		return citaRepository.findById(id);
	}

	@Override
	public void eliminarCita(Integer id) {
		citaRepository.deleteById(id);
	}

	@Override
	public List<Cita> buscarPorUsuario(Integer usuarioId) {
		return citaRepository.findByUsuarioId(usuarioId);
	}

	@Override
	public List<Cita> buscarPorVeterinario(Integer veterinarioId) {
		return citaRepository.findByVeterinarioId(veterinarioId);
	}

	@Override
	public List<Cita> buscarPorUsuarioYFechaRango(Integer usuarioId, LocalDateTime inicio, LocalDateTime fin) {
		return citaRepository.findByUsuarioIdAndFechaHoraBetween(usuarioId, inicio, fin);
	}

	@Override
	public List<Cita> buscarPorVeterinariaYFechaRango(Integer veterinarioId, LocalDateTime inicio, LocalDateTime fin) {
		return citaRepository.findByVeterinarioIdAndFechaHoraBetween(veterinarioId, inicio, fin);
	}

}
