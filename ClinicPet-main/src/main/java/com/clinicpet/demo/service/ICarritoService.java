package com.clinicpet.demo.service;

import java.util.List;
import java.util.Optional;

import com.clinicpet.demo.model.Carrito;
import com.clinicpet.demo.model.Carrito.EstadoCarrito;

public interface ICarritoService {

	// Obtener todos los carritos
	List<Carrito> listarCarritos();

	// Obtener carrito por ID
	Optional<Carrito> obtenerCarritoPorId(Integer id);

	// Buscar carrito ACTIVO de un usuario
	Optional<Carrito> obtenerCarritoActivoUsuario(Integer usuarioId);

	// Buscar todos los carritos de un usuario
	List<Carrito> obtenerCarritosPorUsuario(Integer usuarioId);

	// Buscar carritos por estado
	List<Carrito> obtenerCarritosPorEstado(EstadoCarrito estado);

	// Crear nuevo carrito
	Carrito crearCarrito(Carrito carrito);

	// Actualizar carrito existente
	Carrito actualizarCarrito(Integer id, Carrito carritoActualizado);

	// Eliminar carrito
	void eliminarCarrito(Integer id);

	// Métodos específicos de negocio
	Carrito crearCarritoParaUsuario(Integer usuarioId);

	Carrito confirmarCarrito(Integer usuarioId);

	void cancelarCarrito(Integer usuarioId);
}
