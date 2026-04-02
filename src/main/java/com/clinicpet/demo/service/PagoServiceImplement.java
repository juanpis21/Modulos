package com.clinicpet.demo.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clinicpet.demo.model.Pago;
import com.clinicpet.demo.model.Venta;
import com.clinicpet.demo.repository.IPagoRepository;
import com.clinicpet.demo.repository.IVentaRepository;

@Service
public class PagoServiceImplement implements IPagoService {

	@Autowired
	private IPagoRepository pagoRepository;

	@Autowired
	private IVentaRepository ventaRepository;

	@Override
	public Pago guardarPago(Pago pago) {
		// TODO Auto-generated method stub
		validarPago(pago);

		// Establecer fecha de pago automáticamente si no viene especificada
		if (pago.getFechaPago() == null) {
			pago.setFechaPago(LocalDateTime.now());
		}

		// Si no tiene estado, establecer como "pendiente"
		if (pago.getEstado() == null || pago.getEstado().trim().isEmpty()) {
			pago.setEstado("Pendiente");
		}

		return pagoRepository.save(pago);
	}

	@Override
	public List<Pago> obtenerTodosLosPagos() {
		// TODO Auto-generated method stub
		return pagoRepository.findAll();
	}

	@Override
	public Optional<Pago> obtenerPagoPorId(Integer id) {
		// TODO Auto-generated method stub
		return pagoRepository.findById(id);
	}

	@Override
	public void eliminarPago(Integer id) {
		// TODO Auto-generated method stub
		if (!pagoRepository.existsById(id)) {
			throw new IllegalArgumentException("No existe un pago con el ID: " + id);
		}
		pagoRepository.deleteById(id);
	}

	@Override
	public Optional<Pago> obtenerPagoPorVenta(Integer ventaId) {
		// TODO Auto-generated method stub
		return pagoRepository.findByVenta_Id(ventaId);
	}

	@Override
	public List<Pago> obtenerPagosPorEstado(String estado) {
		// TODO Auto-generated method stub
		return pagoRepository.findByEstado(estado);
	}

	@Override
	public List<Pago> obtenerPagosPorMetodo(String metodo) {
		// TODO Auto-generated method stub
		return pagoRepository.findByMetodo(metodo);
	}

	@Override
	public List<Pago> obtenerPagosPorRangoFechas(LocalDateTime inicio, LocalDateTime fin) {
		// TODO Auto-generated method stub
		return pagoRepository.findByFechaPagoBetween(inicio, fin);
	}

	@Override
	public List<Pago> obtenerPagosPorUsuario(Integer usuarioId) {
		// TODO Auto-generated method stub
		return pagoRepository.findByVenta_Usuario_Id(usuarioId);
	}

	@Override
	public Pago procesarPago(Integer ventaId, String metodoPago, String referencia) {
		// TODO Auto-generated method stub
		Venta venta = ventaRepository.findById(ventaId)
				.orElseThrow(() -> new IllegalArgumentException("No existe la venta con ID: " + ventaId));

		// Verificar si ya existe un pago para esta venta
		Optional<Pago> pagoExistente = obtenerPagoPorVenta(ventaId);
		if (pagoExistente.isPresent()) {
			throw new IllegalStateException("Ya existe un pago para esta venta");
		}

		Pago pago = new Pago();
		pago.setMetodo(metodoPago);
		pago.setReferencia(referencia);
		pago.setEstado("Pendiente");
		pago.setFechaPago(LocalDateTime.now());
		pago.setVenta(venta);

		return guardarPago(pago);
	}

	@Override
	public Pago marcarComoAprobado(Integer pagoId) {
		// TODO Auto-generated method stub
		Pago pago = pagoRepository.findById(pagoId)
				.orElseThrow(() -> new IllegalArgumentException("No existe el pago con ID: " + pagoId));

		pago.setEstado("Aprobado");
		pago.setFechaPago(LocalDateTime.now());

		return pagoRepository.save(pago);
	}

	@Override
	public Pago marcarComoRechazado(Integer pagoId) {
		// TODO Auto-generated method stub
		Pago pago = pagoRepository.findById(pagoId)
				.orElseThrow(() -> new IllegalArgumentException("No existe el pago con ID: " + pagoId));

		pago.setEstado("Rechazado");

		return pagoRepository.save(pago);
	}

	@Override
	public List<Pago> obtenerPagosPendientes() {
		// TODO Auto-generated method stub
		return obtenerPagosPorEstado("Pendiente");
	}

	@Override
	public List<Pago> obtenerPagosAprobados() {
		// TODO Auto-generated method stub
		return obtenerPagosPorEstado("Aprobado");
	}

	@Override
	public List<Pago> obtenerPagosRechazados() {
		// TODO Auto-generated method stub
		return obtenerPagosPorEstado("Rechazado");
	}

	@Override
	public double calcularTotalPagadoPorUsuario(Integer usuarioId) {
		// TODO Auto-generated method stub
		List<Pago> pagosUsuario = obtenerPagosPorUsuario(usuarioId);

		return pagosUsuario.stream().filter(pago -> "Aprobado".equals(pago.getEstado()))
				.mapToDouble(pago -> pago.getVenta().getTotal()).sum();
	}

	@Override
	public List<Pago> obtenerPagosRecientes() {
		// TODO Auto-generated method stub
		LocalDateTime last24Hours = LocalDateTime.now().minusHours(24);
		return obtenerPagosPorRangoFechas(last24Hours, LocalDateTime.now());
	}

	// Método para validaciones
	private void validarPago(Pago pago) {
		if (pago.getMetodo() == null || pago.getMetodo().trim().isEmpty()) {
			throw new IllegalArgumentException("El método de pago es obligatorio");
		}

		if (pago.getVenta() == null) {
			throw new IllegalArgumentException("La venta es obligatoria");
		}

		// Validar métodos de pago permitidos
		List<String> metodosPermitidos = List.of("tarjeta", "pse", "paypal", "bancolombia", "rappipay", "nequi",
				"daviplata", "mercado-pago");
		if (!metodosPermitidos.contains(pago.getMetodo().toLowerCase())) {
			throw new IllegalArgumentException(
					"Método de pago no válido: " + pago.getMetodo() + ". Métodos permitidos: " + metodosPermitidos);
		}

		// Validar estados permitidos (actualizado)
		List<String> estadosPermitidos = List.of("Pendiente", "Aprobado", "Rechazado");
		if (pago.getEstado() != null && !estadosPermitidos.contains(pago.getEstado().toLowerCase())) {
			throw new IllegalArgumentException(
					"Estado de pago no válido: " + pago.getEstado() + ". Estados permitidos: " + estadosPermitidos);
		}

		// Validar que la fecha de pago no sea futura
		if (pago.getFechaPago() != null && pago.getFechaPago().isAfter(LocalDateTime.now())) {
			throw new IllegalArgumentException("La fecha de pago no puede ser futura");
		}
	}

	// Obtener todos los pagos del mes actual
	public List<Pago> obtenerPagosDelMes() {
		LocalDateTime inicioMes = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
		LocalDateTime finMes = LocalDateTime.now().withDayOfMonth(LocalDateTime.now().toLocalDate().lengthOfMonth())
				.withHour(23).withMinute(59).withSecond(59);

		return obtenerPagosPorRangoFechas(inicioMes, finMes);
	}

	// obtener todos los pagos del dia actual
	public List<Pago> obtenerPagosDeHoy() {
		LocalDateTime inicioDia = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
		LocalDateTime finDia = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59);

		return obtenerPagosPorRangoFechas(inicioDia, finDia);
	}

	// metodos para reportes
	public double calcularIngresosTotales() {
		return obtenerPagosAprobados().stream().mapToDouble(pago -> pago.getVenta().getTotal()).sum();
	}

	public double calcularIngresosDelMes() {
		return obtenerPagosDelMes().stream().filter(pago -> "aprobado".equals(pago.getEstado()))
				.mapToDouble(pago -> pago.getVenta().getTotal()).sum();
	}

	public Map<String, Long> obtenerEstadisticasMetodosPago() {
		return obtenerPagosAprobados().stream().collect(Collectors.groupingBy(Pago::getMetodo, Collectors.counting()));
	}

	// busqueda avanzada con multiples filtros combinados
	public List<Pago> obtenerPagosPorFiltrar(String estado, String metodo, LocalDateTime fechaInicio,
			LocalDateTime fechaFin) {
		List<Pago> todosPagos = obtenerTodosLosPagos();

		return todosPagos.stream().filter(pago -> estado == null || estado.equals(pago.getEstado()))
				.filter(pago -> metodo == null || metodo.equals(pago.getMetodo()))
				.filter(pago -> fechaInicio == null || !pago.getFechaPago().isBefore(fechaInicio))
				.filter(pago -> fechaFin == null || !pago.getFechaPago().isAfter(fechaFin)).toList();
	}
}
