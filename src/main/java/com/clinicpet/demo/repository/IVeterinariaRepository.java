package com.clinicpet.demo.repository;

import com.clinicpet.demo.model.Veterinaria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IVeterinariaRepository extends JpaRepository<Veterinaria, Integer> {

	Optional<Veterinaria> findByNombre(String nombre);

	Optional<Veterinaria> findByCorreo(String correo);

	Optional<Veterinaria> findByTelefono(String telefono);


	boolean existsByNombre(String nombre);

	boolean existsByCorreo(String correo);

	boolean existsByTelefono(String telefono);

	Optional<Veterinaria> findById(Integer id);

	List<Veterinaria> findByNombreContainingIgnoreCase(String nombre);

	List<Veterinaria> findByDireccionContainingIgnoreCase(String direccion);

	List<Veterinaria> findByDescripcionContainingIgnoreCase(String descripcion);

	List<Veterinaria> findByHorarioContaining(String horario);

	List<Veterinaria> findByEstado(String estado);

	List<Veterinaria> findAllByOrderByNombreAsc();
}