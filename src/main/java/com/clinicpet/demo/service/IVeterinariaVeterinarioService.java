package com.clinicpet.demo.service;

import com.clinicpet.demo.model.Usuario;
import com.clinicpet.demo.model.Veterinaria;
import com.clinicpet.demo.model.VeterinariaVeterinario;

import java.util.List;
import java.util.Optional;

public interface IVeterinariaVeterinarioService {

	// Métodos CRUD básicos
	List<VeterinariaVeterinario> findAll();

	Optional<VeterinariaVeterinario> findById(Integer id);

	VeterinariaVeterinario save(VeterinariaVeterinario veterinariaVeterinario);

	void deleteById(Integer id);

	// Métodos específicos de la relación
	List<Usuario> findVeterinariosByVeterinariaId(Integer veterinariaId);

	List<Veterinaria> findVeterinariasByVeterinarioId(Integer veterinarioId);

	Optional<VeterinariaVeterinario> findByVeterinariaIdAndVeterinarioId(Integer veterinariaId, Integer veterinarioId);

	boolean existsByVeterinariaIdAndVeterinarioId(Integer veterinariaId, Integer veterinarioId);

	long countByVeterinariaId(Integer veterinariaId);

	long countByVeterinarioId(Integer veterinarioId);

	void deleteByVeterinariaId(Integer veterinariaId);

	void deleteByVeterinarioId(Integer veterinarioId);

	List<Integer> findVeterinariaIdsByVeterinarioId(Integer veterinarioId);

	List<Integer> findVeterinarioIdsByVeterinariaId(Integer veterinariaId);

	// Métodos adicionales útiles
	VeterinariaVeterinario createRelationship(Integer veterinariaId, Integer veterinarioId);

	void removeRelationship(Integer veterinariaId, Integer veterinarioId);
}