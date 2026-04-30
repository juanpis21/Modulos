package com.clinicpet.demo.service;

import java.util.List;
import java.util.Optional;

import com.clinicpet.demo.model.CarritoProducto;

public interface ICarritoProductoService {
	// CRUD

	CarritoProducto guardarCarritoPrroducto(CarritoProducto carritoProducto);

	List<CarritoProducto> listarCarritoProductos(CarritoProducto carritoProducto);

	Optional<CarritoProducto> buscarPorId(Integer id);

	void eliminarCarritoProducto(Integer productoId);

	// METODOS PERSONALIZADOS

	List<CarritoProducto> buscarPorCarrito(Integer carritoId);

	List<CarritoProducto> buscarPorCarritoYProducto(Integer carritoId, Integer productoId);

	List<CarritoProducto> buscarPorProducto(Integer productoId);

}
