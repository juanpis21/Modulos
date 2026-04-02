package com.clinicpet.demo.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.clinicpet.demo.model.Pago;

public interface IPagoService {

	// Guardar/actualizar un pago
	public Pago guardarPago(Pago pago);

	// Obtener todos los pagos
	public List<Pago> obtenerTodosLosPagos();

	// Obtener un pago por ID
	public Optional<Pago> obtenerPagoPorId(Integer id);

	// Eliminar un pago por ID
	public void eliminarPago(Integer id);

	public Optional<Pago> obtenerPagoPorVenta(Integer ventaId);

	public List<Pago> obtenerPagosPorEstado(String estado);

	public List<Pago> obtenerPagosPorMetodo(String metodo);

	public List<Pago> obtenerPagosPorRangoFechas(LocalDateTime inicio, LocalDateTime fin);

	public List<Pago> obtenerPagosPorUsuario(Integer usuarioId);

	// Métodos para gestión de pagos

	public Pago procesarPago(Integer ventaId, String metodoPago, String referencia);

	public Pago marcarComoAprobado(Integer pagoId);

	public Pago marcarComoRechazado(Integer pagoId);

	public List<Pago> obtenerPagosPendientes();

	public List<Pago> obtenerPagosAprobados();

	public List<Pago> obtenerPagosRechazados();

	public double calcularTotalPagadoPorUsuario(Integer usuarioId);

	public List<Pago> obtenerPagosRecientes();

}
