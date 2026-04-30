package com.clinicpet.demo.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.clinicpet.demo.model.HistoriaClinica;

@Repository
public interface IHistoriaClinicaRepository extends JpaRepository<HistoriaClinica, Integer> {
	
    List<HistoriaClinica> findByMascota_Id(Integer mascotaId);

    List<HistoriaClinica> findByVeterinario_Id(Integer veterinarioId);

    List<HistoriaClinica> findByUsuario_Id(Integer usuarioId);

    // Buscar historias clínicas en una veterinaria específica
    List<HistoriaClinica> findByVeterinaria_Id(Integer veterinariaId);

    // Buscar historias clínicas de mascotas en un rango de fechas
    List<HistoriaClinica> findByMascota_IdAndFechaBetween(Integer mascotaId, LocalDate inicio, LocalDate fin);
}

	


