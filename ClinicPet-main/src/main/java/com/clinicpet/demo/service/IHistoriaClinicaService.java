package com.clinicpet.demo.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.clinicpet.demo.model.HistoriaClinica;

public interface IHistoriaClinicaService {
	
	//Guardar cambios/actualizaciones a una Historia Clinica
	public HistoriaClinica guardarHistoriaClinica(HistoriaClinica historiaClinica);
	
	public List<HistoriaClinica> obtenerTodasLasHistoriasClinicas();
    
	public Optional<HistoriaClinica> obtenerHistoriaClinicaPorId(Integer id);
    
    // Eliminar una historia clínica por ID
	public void eliminarHistoriaClinica(Integer id);
    
	public List<HistoriaClinica> obtenerHistoriasPorMascota(Integer mascotaId);
	public List<HistoriaClinica> obtenerHistoriasPorVeterinario(Integer veterinarioId);
	public List<HistoriaClinica> obtenerHistoriasPorUsuario(Integer usuarioId);
	public List<HistoriaClinica> obtenerHistoriasPorVeterinaria(Integer veterinariaId);
	public List<HistoriaClinica> obtenerHistoriasPorMascotaYRangoFechas(Integer mascotaId, LocalDate inicio, LocalDate fin);

}
