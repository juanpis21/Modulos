package com.clinicpet.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.clinicpet.demo.model.Evento;

import java.time.LocalDate;

@Repository
public interface IEventoRepository extends JpaRepository<Evento, Integer> {
	
	//Buscar eventos activos (que no han terminado aun).
	List<Evento> findByFechafinAfter(LocalDate fechaActual);
	
}
