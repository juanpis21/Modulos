package com.clinicpet.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.clinicpet.demo.model.DetalleVenta;

@Service
public interface IDetalleVentaService {

	// CRUD

	DetalleVenta guardarDetalleVenta(DetalleVenta detalleVenta);

	List<DetalleVenta> listarDetalleDeVenta();

	Optional<DetalleVenta> buscarDetalleVenta(Integer id);

	void eliminarDetalleVenta(Integer id);

	// METODOS PERSONALIZADOS

	// buscar por venta
	List<DetalleVenta> buscarPorVenta(Integer ventaId);

	// buscar por producto
	List<DetalleVenta> buscarPorProducto(Integer productoId);

	// buscar por venta y producto
	Optional<DetalleVenta> buscarPorVentaYProducto(Integer ventaId, Integer productoId);
}
