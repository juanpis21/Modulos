package com.clinicpet.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.clinicpet.demo.model.Carrito;
import com.clinicpet.demo.model.Carrito.EstadoCarrito;

@Repository
public interface ICarritoRepository extends JpaRepository<Carrito, Integer> {

	// buscar todos los carritos de un usuario
	List<Carrito> findByUsuarioId(Integer usuarioId);

	// buscar carritos de un usuario por su estado
	Optional<Carrito> findByUsuarioIdAndEstado(Integer usuarioId, EstadoCarrito estado);

	// buscar todos los carritos por estado
	List<Carrito> findByEstado(EstadoCarrito estado);
}
