package com.clinicpet.demo.service;

import com.clinicpet.demo.model.Adopcion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface IAdopcionService {

	Adopcion guardarAdopcion(Adopcion adopcion);

	List<Adopcion> listarAdopciones();

	Optional<Adopcion> buscarAdopcionById(Integer id);

	void eliminarAdopcion(Integer id);

	List<Adopcion> buscarAdopcionesByEstado(String estado);

	List<Adopcion> buscarAdopcionesByVeterinaria(Integer idVeterinaria);

	List<Adopcion> buscarAdopcionesByUsuarioId(Integer idUsuario);

	Page<Adopcion> buscarConFiltros(String tipoMascota, String raza, String tamano, Pageable pageable);

	Page<Adopcion> buscarDisponibles(Pageable pageable);

	Page<Adopcion> buscarPorUsuarioId(Integer idUsuario, Pageable pageable);

	long contarPorEstado(String estado);

}