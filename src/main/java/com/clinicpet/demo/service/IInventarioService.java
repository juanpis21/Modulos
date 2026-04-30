package com.clinicpet.demo.service;

import java.util.List;
import java.util.Optional;

import com.clinicpet.demo.model.Inventario;

public interface IInventarioService {

	// Guardar/actualizar un registro de inventario
	public Inventario guardarInventario(Inventario inventario);

	public List<Inventario> obtenerTodoElInventario();

	public Optional<Inventario> obtenerInventarioPorId(Integer id);

	public void eliminarInventario(Integer id);

	List<Inventario> obtenerInventarioPorVeterinaria(Integer veterinariaId);

	List<Inventario> obtenerInventarioPorProducto(Integer productoId);

	List<Inventario> obtenerProductosConStockBajo(Integer cantidadMinima);

	List<Inventario> obtenerProductosConStockSuficiente(Integer cantidadMinima);

	// Metodos para gestión de inventario
	Inventario actualizarStock(Integer inventarioId, Integer nuevaCantidad);

	Inventario agregarStock(Integer inventarioId, Integer cantidadAagregar);

	Inventario reducirStock(Integer inventarioId, Integer cantidadAReducir);

	Inventario obtenerInventarioPorVeterinariaYProducto(Integer veterinariaId, Integer productoId);

}
