package com.clinicpet.demo.service;

import com.clinicpet.demo.model.*;
import com.clinicpet.demo.repository.IVentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class VentaServiceImplement implements IVentaService {

	@Autowired
	private IVentaRepository ventaRepository;

	@Override
	@Transactional(readOnly = true)
	public List<Venta> findAll() {
		return ventaRepository.findAll();
	}

	@Override
	@Transactional(readOnly = true)
	public Optional<Venta> findById(Integer id) {
		return ventaRepository.findById(id);
	}

	@Override
	@Transactional
	public Venta save(Venta venta) {
		// Validar y calcular totales si es necesario
		if (venta.getFecha() == null) {
			venta.setFecha(new Date());
		}
		return ventaRepository.save(venta);
	}

	@Override
	@Transactional
	public Venta update(Venta venta) {
		if (venta.getId() != null && ventaRepository.existsById(venta.getId())) {
			return ventaRepository.save(venta);
		}
		throw new RuntimeException("Venta no encontrada para actualizar");
	}

	@Override
	@Transactional
	public void deleteById(Integer id) {
		ventaRepository.deleteById(id);
	}

	@Override
	@Transactional(readOnly = true)
	public List<Venta> findByUsuario(Usuario usuario) {
		return ventaRepository.findByUsuario(usuario);
	}

	@Override
	@Transactional(readOnly = true)
	public List<Venta> findByUsuarioId(Integer usuarioId) {
		return ventaRepository.findByUsuarioId(usuarioId);
	}

	@Override
	@Transactional(readOnly = true)
	public List<Venta> findByFechaBetween(Date fechaInicio, Date fechaFin) {
		return ventaRepository.findByFechaBetween(fechaInicio, fechaFin);
	}

	@Override
	@Transactional(readOnly = true)
	public List<Venta> findByFechaAfter(Date fecha) {
		return ventaRepository.findByFechaAfter(fecha);
	}

	@Override
	@Transactional(readOnly = true)
	public List<Venta> findByFechaBefore(Date fecha) {
		return ventaRepository.findByFechaBefore(fecha);
	}

	@Override
	@Transactional(readOnly = true)
	public List<Venta> findByTotalGreaterThan(Double total) {
		return ventaRepository.findByTotalGreaterThan(total);
	}

	@Override
	@Transactional(readOnly = true)
	public List<Venta> findByTotalLessThan(Double total) {
		return ventaRepository.findByTotalLessThan(total);
	}

	@Override
	@Transactional(readOnly = true)
	public List<Venta> findByTotalBetween(Double minTotal, Double maxTotal) {
		return ventaRepository.findByTotalBetween(minTotal, maxTotal);
	}

	@Override
	@Transactional(readOnly = true)
	public long countByUsuario(Usuario usuario) {
		return ventaRepository.countByUsuario(usuario);
	}

	@Override
	@Transactional(readOnly = true)
	public Double sumTotalByUsuarioId(Integer usuarioId) {
		return ventaRepository.sumTotalByUsuarioId(usuarioId);
	}

	@Override
	@Transactional(readOnly = true)
	public Double sumTotalByFechaBetween(Date fechaInicio, Date fechaFin) {
		return ventaRepository.sumTotalByFechaBetween(fechaInicio, fechaFin);
	}

	@Override
	@Transactional(readOnly = true)
	public Venta findVentaWithPago(Integer ventaId) {
		return ventaRepository.findVentaWithPago(ventaId);
	}

	@Override
	@Transactional(readOnly = true)
	public List<Venta> findByMonthAndYear(int month, int year) {
		return ventaRepository.findByMonthAndYear(month, year);
	}

	@Override
	@Transactional(readOnly = true)
	public List<Venta> findTop10ByOrderByFechaDesc() {
		return ventaRepository.findTop10ByOrderByFechaDesc();
	}

	@Override
	@Transactional(readOnly = true)
	public List<Venta> findBySubtotalGreaterThan(Double subtotal) {
		return ventaRepository.findBySubtotalGreaterThan(subtotal);
	}

	@Override
	@Transactional(readOnly = true)
	public boolean existsByUsuarioAndFecha(Usuario usuario, Date fecha) {
		return ventaRepository.existsByUsuarioAndFecha(usuario, fecha);
	}

	@Override
	@Transactional(readOnly = true)
	public List<Object[]> getDailySales(Date start, Date end) {
		return ventaRepository.getDailySales(start, end);
	}

	@Override
	@Transactional(readOnly = true)
	public Venta findVentaCompleta(Integer ventaId) {
		return ventaRepository.findVentaCompleta(ventaId);
	}

	// Métodos adicionales de negocio
	@Override
	@Transactional
	public Venta crearVentaConDetalles(Venta venta, List<DetalleVenta> detalles) {
		// Lógica para crear venta con detalles
		venta.setDetallesVenta(detalles);
		// Calcular totales
		Double subtotal = calcularTotalVenta(detalles);
		venta.setSubtotal(subtotal);
		venta.setTotal(subtotal); // Puede agregar impuestos aquí
		return ventaRepository.save(venta);
	}

	@Override
	@Transactional
	public Venta procesarPagoVenta(Integer ventaId, Pago pago) {
		Optional<Venta> ventaOpt = ventaRepository.findById(ventaId);
		if (ventaOpt.isPresent()) {
			Venta venta = ventaOpt.get();
			pago.setVenta(venta);
			venta.setPago(pago);
			return ventaRepository.save(venta);
		}
		throw new RuntimeException("Venta no encontrada");
	}

	@Override
	public Double calcularTotalVenta(List<DetalleVenta> detalles) {
		return detalles.stream().mapToDouble(detalle -> detalle.getPrecioUnitario() * detalle.getCantidad()).sum();
	}

	@Override
	@Transactional(readOnly = true)
	public List<Venta> getVentasDelDia() {
		Calendar calendar = Calendar.getInstance();

		// Inicio del día (00:00:00)
		calendar.set(Calendar.HOUR_OF_DAY, 0);
		calendar.set(Calendar.MINUTE, 0);
		calendar.set(Calendar.SECOND, 0);
		calendar.set(Calendar.MILLISECOND, 0);
		Date inicioDia = calendar.getTime();

		// Fin del día (23:59:59)
		calendar.set(Calendar.HOUR_OF_DAY, 23);
		calendar.set(Calendar.MINUTE, 59);
		calendar.set(Calendar.SECOND, 59);
		calendar.set(Calendar.MILLISECOND, 999);
		Date finDia = calendar.getTime();

		return ventaRepository.findByFechaBetween(inicioDia, finDia);
	}

	@Override
	@Transactional(readOnly = true)
	public Double getTotalVentasHoy() {
		Calendar calendar = Calendar.getInstance();

		// Inicio del día (00:00:00)
		calendar.set(Calendar.HOUR_OF_DAY, 0);
		calendar.set(Calendar.MINUTE, 0);
		calendar.set(Calendar.SECOND, 0);
		calendar.set(Calendar.MILLISECOND, 0);
		Date inicioDia = calendar.getTime();

		// Fin del día (23:59:59)
		calendar.set(Calendar.HOUR_OF_DAY, 23);
		calendar.set(Calendar.MINUTE, 59);
		calendar.set(Calendar.SECOND, 59);
		calendar.set(Calendar.MILLISECOND, 999);
		Date finDia = calendar.getTime();

		Double total = ventaRepository.sumTotalByFechaBetween(inicioDia, finDia);
		return total != null ? total : 0.0; // Manejar caso null
	}

	@Override
	public Venta findVentaWithDetalles(Integer ventaId) {
		// TODO Auto-generated method stub
		return null;
	}
}
