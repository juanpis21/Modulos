package com.clinicpet.demo.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clinicpet.demo.model.HistoriaClinica;
import com.clinicpet.demo.repository.IHistoriaClinicaRepository;

@Service
public class HistoriaClinicaServiceImplement implements IHistoriaClinicaService {

	@Autowired
	private IHistoriaClinicaRepository historiaClinicaRepository;

	@Override
	public HistoriaClinica guardarHistoriaClinica(HistoriaClinica historiaClinica) {
		// TODO Auto-generated method stub
		// Validacion antes de guardar
		validarHistoriaClinica(historiaClinica);

		// Si pasa las validaciones, guardar
		return historiaClinicaRepository.save(historiaClinica);
	}

	@Override
	public List<HistoriaClinica> obtenerTodasLasHistoriasClinicas() {
		// TODO Auto-generated method stub
		return historiaClinicaRepository.findAll();
	}

	@Override
	public Optional<HistoriaClinica> obtenerHistoriaClinicaPorId(Integer id) {
		// TODO Auto-generated method stub
		return historiaClinicaRepository.findById(id);
	}

	@Override
	public void eliminarHistoriaClinica(Integer id) {
		// TODO Auto-generated method stub
		// verificar si existe la historia clinica
		if (!historiaClinicaRepository.existsById(id)) {
			throw new IllegalArgumentException("No existe una historia clinica con el ID: " + id);
		}
		historiaClinicaRepository.deleteById(id);
	}

	@Override
	public List<HistoriaClinica> obtenerHistoriasPorMascota(Integer mascotaId) {
		// TODO Auto-generated method stub
		return historiaClinicaRepository.findByMascota_Id(mascotaId);
	}

	@Override
	public List<HistoriaClinica> obtenerHistoriasPorVeterinario(Integer veterinarioId) {
		// TODO Auto-generated method stub
		return historiaClinicaRepository.findByVeterinario_Id(veterinarioId);
	}

	@Override
	public List<HistoriaClinica> obtenerHistoriasPorUsuario(Integer usuarioId) {
		// TODO Auto-generated method stub
		return historiaClinicaRepository.findByUsuario_Id(usuarioId);
	}

	@Override
	public List<HistoriaClinica> obtenerHistoriasPorVeterinaria(Integer veterinariaId) {
		// TODO Auto-generated method stub
		return historiaClinicaRepository.findByVeterinaria_Id(veterinariaId);
	}

	@Override
	public List<HistoriaClinica> obtenerHistoriasPorMascotaYRangoFechas(Integer mascotaId, LocalDate inicio,
			LocalDate fin) {
		// TODO Auto-generated method stub
		return historiaClinicaRepository.findByMascota_IdAndFechaBetween(mascotaId, inicio, fin);
	}

	// metodo para Validaciones
	private void validarHistoriaClinica(HistoriaClinica historiaClinica) {
		// Validar que la fecha no sea futura.
		if (historiaClinica.getFecha().isAfter(LocalDate.now())) {
			throw new IllegalArgumentException("La fecha de la Historia Clinica no puede ser futura");

		}

		// Validar que campos obligatorios no estén vacíos
		if (historiaClinica.getDiagnostico() == null || historiaClinica.getDiagnostico().trim().isEmpty()) {
			throw new IllegalArgumentException("El Diagnóstico es obligatorio");
		}

		if (historiaClinica.getTratamiento() == null || historiaClinica.getTratamiento().trim().isEmpty()) {
			throw new IllegalArgumentException("El Tratamiento es obligatorio");
		}

		// Validar que las relaciones sean obligatorias
		if (historiaClinica.getMascota() == null) {
			throw new IllegalArgumentException("La Mascota es obligatoria");
		}

		if (historiaClinica.getVeterinario() == null) {
			throw new IllegalArgumentException("El Veterinario es obligatorio");
		}

		if (historiaClinica.getVeterinaria() == null) {
			throw new IllegalArgumentException("La Veterinaria es obligatoria");
		}

		if (historiaClinica.getUsuario() == null) {
			throw new IllegalArgumentException("El Usuario es obligatorio");
		}
	}

	// metodo para filtrar y devolver Historias Clinicas de los ultimos 30 dias.
	public List<HistoriaClinica> obtenerHistoriasRecientes() {
		LocalDate haceUnMes = LocalDate.now().minusMonths(1);
		return obtenerTodasLasHistoriasClinicas().stream().filter(hc -> !hc.getFecha().isBefore(haceUnMes)).toList();
	}

	// metodo para filtrar y devolver solo las historias clinias que se registraron
	// en la fecha actual (hoy) para ver lo que se ha atendido en el dia.
	public List<HistoriaClinica> obtenerHistoriasDeHoy() {
		LocalDate hoy = LocalDate.now();
		return obtenerTodasLasHistoriasClinicas().stream().filter(hc -> hc.getFecha().equals(hoy)).toList();
	}

	// metodo para tener el historial de la mascota ordenado,para ver la evolucion
	// de la salud de la mascota.
	public List<HistoriaClinica> obtenerHistorialCompletoMascota(Integer mascotaId) {
		List<HistoriaClinica> historiales = obtenerHistoriasPorMascota(mascotaId);
		// Ordenar de más reciente a más antiguo
		historiales.sort((hc1, hc2) -> hc2.getFecha().compareTo(hc1.getFecha()));
		return historiales;
	}

	// metodo para contar historias por veterinario, para saber que veterinario
	// atiende mas casos (rendimiento del personal).
	public Map<Object, Long> contarHistoriasPorVeterinario() {
		return obtenerTodasLasHistoriasClinicas().stream()
				.collect(Collectors.groupingBy(hc -> hc.getVeterinario().getNombres(), Collectors.counting()));
	}

}
