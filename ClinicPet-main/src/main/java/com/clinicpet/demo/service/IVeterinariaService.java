package com.clinicpet.demo.service;

import com.clinicpet.demo.model.Veterinaria;
import java.util.List;
import java.util.Optional;

public interface IVeterinariaService {

	// Métodos CRUD básicos
	List<Veterinaria> findAll();

	Veterinaria findById(Integer id);
	
	Optional<Veterinaria> obtenerPorId(Integer id);

	Veterinaria save(Veterinaria veterinaria);

	Veterinaria update(Veterinaria veterinaria);

	void deleteById(Integer id);

	// Métodos de búsqueda específicos
	List<Veterinaria> listarPorEstado(String estado);

	List<Veterinaria> listarPendientes();

	Veterinaria desactivarVeterinaria(Integer id);

	Veterinaria activarVeterinaria(Integer id);

	List<Veterinaria> listarAprobadas();

	Veterinaria aprobarVeterinaria(Integer id);

	Veterinaria rechazarVeterinaria(Integer id);

	Optional<Veterinaria> findByNombre(String nombre);

	List<Veterinaria> findByNombreContainingIgnoreCase(String nombre);

	List<Veterinaria> findByDireccionContainingIgnoreCase(String direccion);

	Optional<Veterinaria> findByCorreo(String correo);

	Optional<Veterinaria> findByTelefono(String telefono);

	boolean existsByNombre(String nombre);

	boolean existsByCorreo(String correo);

	boolean existsByTelefono(String telefono);

	List<Veterinaria> findByCiudad(String ciudad);

	long countTotalVeterinarias();

	List<Veterinaria> findByServicioNombre(String servicio);

	List<Veterinaria> findByHorarioContaining(String horario);

	List<Veterinaria> findAllOrderByNombreAsc();

	List<Veterinaria> findByDescripcionContainingIgnoreCase(String descripcion);

	// Métodos adicionales útiles
	List<Veterinaria> searchByMultipleFields(String keyword);

	boolean validateVeterinariaData(Veterinaria veterinaria);

}
