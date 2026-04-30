package com.clinicpet.demo.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.clinicpet.demo.model.Cita;

@Repository
public interface ICitaRepository extends JpaRepository<Cita, Integer> {

	// buscar todas las citas de un usuario
	List<Cita> findByUsuarioId(Integer usuarioId);

	// buscar las citas de un veterinario
	List<Cita> findByVeterinarioId(Integer veterinarioId);

	// Buscar citas de un usuario en un rango de fechas
	List<Cita> findByUsuarioIdAndFechaHoraBetween(Integer usuarioId, LocalDateTime inicio, LocalDateTime fin); // between=rango

	// Buscar citas de un veterinario en un rango de fechas
	List<Cita> findByVeterinarioIdAndFechaHoraBetween(Integer veterinarioId, LocalDateTime inicio, LocalDateTime fin);

}
