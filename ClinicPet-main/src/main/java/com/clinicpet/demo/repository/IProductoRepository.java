package com.clinicpet.demo.repository;

import com.clinicpet.demo.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IProductoRepository extends JpaRepository<Producto, Integer> {

	// Buscar productos por nombre (contiene)
	List<Producto> findByNombreContainingIgnoreCase(String nombre);

	// Buscar productos por categoría
	List<Producto> findByCategoria(String categoria);

	// Buscar productos por categoría (ignorando mayúsculas/minúsculas)
	List<Producto> findByCategoriaIgnoreCase(String categoria);

	// Buscar productos por precio menor o igual a
	List<Producto> findByPrecioLessThanEqual(Double precio);

	// Buscar productos por precio mayor o igual a
	List<Producto> findByPrecioGreaterThanEqual(Double precio);

	// Buscar productos por rango de precio
	List<Producto> findByPrecioBetween(Double precioMin, Double precioMax);

	// Buscar producto por nombre exacto
	Optional<Producto> findByNombre(String nombre);

	// Verificar si existe un producto por nombre
	boolean existsByNombre(String nombre);

	// Buscar productos por categoría y ordenar por precio ascendente
	List<Producto> findByCategoriaOrderByPrecioAsc(String categoria);

	// Buscar productos por categoría y ordenar por precio descendente
	List<Producto> findByCategoriaOrderByPrecioDesc(String categoria);

	// Buscar todos los productos ordenados por nombre
	List<Producto> findAllByOrderByNombreAsc();

	// Buscar todos los productos ordenados por precio ascendente
	List<Producto> findAllByOrderByPrecioAsc();

	// Buscar todos los productos ordenados por precio descendente
	List<Producto> findAllByOrderByPrecioDesc();

	List<Producto> findByNombreContainingIgnoreCaseOrDescripcionContainingIgnoreCase(String texto, String texto2);

	List<Producto> findByDescripcionContainingIgnoreCase(String descripcion);
	
	Optional<Producto> findByNombreAndCategoria(String nombre, String categoria);
}