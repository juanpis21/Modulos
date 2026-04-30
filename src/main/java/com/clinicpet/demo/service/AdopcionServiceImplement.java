package com.clinicpet.demo.service;

import com.clinicpet.demo.model.Adopcion;
import com.clinicpet.demo.repository.IAdopcionRepository;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdopcionServiceImplement implements IAdopcionService {


	@Autowired
	private IAdopcionRepository adopcionRepository;


	@Override
	public Adopcion guardarAdopcion(Adopcion adopcion) {
		return adopcionRepository.save(adopcion);
	}

	@Override
	public List<Adopcion> listarAdopciones() {
		return adopcionRepository.findAll();
	}

	@Override
	public Optional<Adopcion> buscarAdopcionById(Integer id) {
		return adopcionRepository.findById(id);
	}

	@Override
	public void eliminarAdopcion(Integer id) {
		adopcionRepository.deleteById(id);
	}

	@Override
	public List<Adopcion> buscarAdopcionesByEstado(String estado) {
		return adopcionRepository.findByEstado(estado);
	}

	@Override
	public List<Adopcion> buscarAdopcionesByVeterinaria(Integer idVeterinaria) {
		return adopcionRepository.findByVeterinariaId(idVeterinaria);
	}

	@Override
	public List<Adopcion> buscarAdopcionesByUsuarioId(Integer idUsuario) {
		return adopcionRepository.findByUsuarioId(idUsuario);
	}

	@Override
	public Page<Adopcion> buscarConFiltros(String tipoMascota, String raza, String tamano, Pageable pageable) {
		return adopcionRepository.buscarConFiltros(tipoMascota, raza, tamano, pageable);
	}

	@Override
	public Page<Adopcion> buscarDisponibles(Pageable pageable) {
		return adopcionRepository.findByEstado(Adopcion.ESTADO_DISPONIBLE, pageable);
	}

	@Override
	public Page<Adopcion> buscarPorUsuarioId(Integer idUsuario, Pageable pageable) {
		return adopcionRepository.findByUsuarioId(idUsuario, pageable);
	}

	@Override
	public long contarPorEstado(String estado) {
		return adopcionRepository.countByEstado(estado); // asume que existe el método en el repositorio
	}

	
}