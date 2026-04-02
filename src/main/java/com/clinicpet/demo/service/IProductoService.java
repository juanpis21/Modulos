package com.clinicpet.demo.service;

import com.clinicpet.demo.model.Producto;
import java.util.List;
import java.util.Optional;

public interface IProductoService {

	Producto crearProducto(Producto producto);

	Optional<Producto> obtenerProductoPorId(Integer id);

	List<Producto> obtenerTodosLosProductos();

	List<Producto> buscarProductosPorNombre(String nombre);

	List<Producto> buscarProductosPorDescripcion(String descripcion);

	List<Producto> buscarProductosPorRangoPrecio(Double precioMin, Double precioMax);

	List<Producto> buscarProductosPorTexto(String texto);

	Producto actualizarProducto(Integer id, Producto producto);

	void eliminarProducto(Integer id);

	boolean existeProductoPorId(Integer id);

	boolean existeProductoPorNombre(String nombre);

	long contarTotalProductos();
	
	Optional<Producto> buscarPorNombreYCategoria(String nombre, String categoria);

	Producto actualizarProducto(Producto producto);

}