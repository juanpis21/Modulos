package com.clinicpet.demo.service;

import com.clinicpet.demo.model.Usuario;
import com.clinicpet.demo.model.Veterinaria;
import com.clinicpet.demo.model.VeterinariaVeterinario;
import com.clinicpet.demo.repository.IVeterinariaVeterinarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class VeterinariaVeterinarioServiceImplement implements IVeterinariaVeterinarioService {

	@Autowired
	private IVeterinariaVeterinarioRepository veterinariaVeterinarioRepository;

	@Override
	@Transactional(readOnly = true)
	public List<VeterinariaVeterinario> findAll() {
		return veterinariaVeterinarioRepository.findAll();
	}

	@Override
	@Transactional(readOnly = true)
	public Optional<VeterinariaVeterinario> findById(Integer id) {
		return veterinariaVeterinarioRepository.findById(id);
	}

	@Override
	@Transactional
	public VeterinariaVeterinario save(VeterinariaVeterinario veterinariaVeterinario) {
		return veterinariaVeterinarioRepository.save(veterinariaVeterinario);
	}

	@Override
	@Transactional
	public void deleteById(Integer id) {
		veterinariaVeterinarioRepository.deleteById(id);
	}

	@Override
	@Transactional(readOnly = true)
	public List<Usuario> findVeterinariosByVeterinariaId(Integer veterinariaId) {
		return veterinariaVeterinarioRepository.findVeterinariosByVeterinariaId(veterinariaId);
	}

	@Override
	@Transactional(readOnly = true)
	public List<Veterinaria> findVeterinariasByVeterinarioId(Integer veterinarioId) {
		return veterinariaVeterinarioRepository.findVeterinariasByVeterinarioId(veterinarioId);
	}

	@Override
	@Transactional(readOnly = true)
	public Optional<VeterinariaVeterinario> findByVeterinariaIdAndVeterinarioId(Integer veterinariaId,
			Integer veterinarioId) {
		return veterinariaVeterinarioRepository.findByVeterinaria_IdAndVeterinario_Id(veterinariaId, veterinarioId);
	}

	@Override
	@Transactional(readOnly = true)
	public boolean existsByVeterinariaIdAndVeterinarioId(Integer veterinariaId, Integer veterinarioId) {
		return veterinariaVeterinarioRepository.existsByVeterinaria_IdAndVeterinario_Id(veterinariaId, veterinarioId);
	}

	@Override
	@Transactional(readOnly = true)
	public long countByVeterinariaId(Integer veterinariaId) {
		return veterinariaVeterinarioRepository.countByVeterinaria_Id(veterinariaId);
	}

	@Override
	@Transactional(readOnly = true)
	public long countByVeterinarioId(Integer veterinarioId) {
		return veterinariaVeterinarioRepository.countByVeterinario_Id(veterinarioId);
	}

	@Override
	@Transactional
	public void deleteByVeterinariaId(Integer veterinariaId) {
		veterinariaVeterinarioRepository.deleteByVeterinaria_Id(veterinariaId);
	}

	@Override
	@Transactional
	public void deleteByVeterinarioId(Integer veterinarioId) {
		veterinariaVeterinarioRepository.deleteByVeterinario_Id(veterinarioId);
	}

	@Override
	@Transactional(readOnly = true)
	public List<Integer> findVeterinariaIdsByVeterinarioId(Integer veterinarioId) {
		return veterinariaVeterinarioRepository.findVeterinariaIdsByVeterinarioId(veterinarioId);
	}

	@Override
	@Transactional(readOnly = true)
	public List<Integer> findVeterinarioIdsByVeterinariaId(Integer veterinariaId) {
		return veterinariaVeterinarioRepository.findVeterinarioIdsByVeterinariaId(veterinariaId);
	}

	@Override
	@Transactional
	public VeterinariaVeterinario createRelationship(Integer veterinariaId, Integer veterinarioId) {
		// Crear una nueva relación
		VeterinariaVeterinario nuevaRelacion = new VeterinariaVeterinario();

		// Crear objetos con solo el ID para evitar tener que cargar las entidades
		// completas
		Veterinaria veterinaria = new Veterinaria();
		veterinaria.setId(veterinariaId);

		Usuario veterinario = new Usuario();
		veterinario.setId(veterinarioId);

		nuevaRelacion.setVeterinaria(veterinaria);
		nuevaRelacion.setVeterinario(veterinario);

		return veterinariaVeterinarioRepository.save(nuevaRelacion);
	}

	@Override
	@Transactional
	public void removeRelationship(Integer veterinariaId, Integer veterinarioId) {
		Optional<VeterinariaVeterinario> relacion = veterinariaVeterinarioRepository
				.findByVeterinaria_IdAndVeterinario_Id(veterinariaId, veterinarioId);

		relacion.ifPresent(vv -> veterinariaVeterinarioRepository.deleteById(vv.getId()));
	}
}
