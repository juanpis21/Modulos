package com.clinicpet.demo.service;

import com.clinicpet.demo.model.DetalleVenta;
import com.clinicpet.demo.model.Pago;
import com.clinicpet.demo.model.Usuario;
import com.clinicpet.demo.model.Venta;
import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface IVentaService {

	// Métodos CRUD básicos
	List<Venta> findAll();

	Optional<Venta> findById(Integer id);

	Venta save(Venta venta);

	Venta update(Venta venta);

	void deleteById(Integer id);

	// Métodos de búsqueda específicos
	List<Venta> findByUsuario(Usuario usuario);

	List<Venta> findByUsuarioId(Integer usuarioId);

	List<Venta> findByFechaBetween(Date fechaInicio, Date fechaFin);

	List<Venta> findByFechaAfter(Date fecha);

	List<Venta> findByFechaBefore(Date fecha);

	List<Venta> findByTotalGreaterThan(Double total);

	List<Venta> findByTotalLessThan(Double total);

	List<Venta> findByTotalBetween(Double minTotal, Double maxTotal);

	long countByUsuario(Usuario usuario);

	Double sumTotalByUsuarioId(Integer usuarioId);

	Double sumTotalByFechaBetween(Date fechaInicio, Date fechaFin);

	Venta findVentaWithDetalles(Integer ventaId);

	Venta findVentaWithPago(Integer ventaId);

	List<Venta> findByMonthAndYear(int month, int year);

	List<Venta> findTop10ByOrderByFechaDesc();

	List<Venta> findBySubtotalGreaterThan(Double subtotal);

	boolean existsByUsuarioAndFecha(Usuario usuario, Date fecha);

	List<Object[]> getDailySales(Date start, Date end);

	Venta findVentaCompleta(Integer ventaId);

	// Métodos adicionales de negocio
	Venta crearVentaConDetalles(Venta venta, List<DetalleVenta> detalles);

	Venta procesarPagoVenta(Integer ventaId, Pago pago);

	Double calcularTotalVenta(List<DetalleVenta> detalles);

	List<Venta> getVentasDelDia();

	Double getTotalVentasHoy();
}