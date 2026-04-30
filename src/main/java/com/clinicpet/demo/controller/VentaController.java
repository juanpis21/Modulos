package com.clinicpet.demo.controller;

import com.clinicpet.demo.model.Venta;
import com.clinicpet.demo.service.IVentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/ventas")
public class VentaController {

	@Autowired
	private IVentaService ventaService;

	@GetMapping
	public ResponseEntity<List<Venta>> obtenerTodasLasVentas() {
		List<Venta> ventas = ventaService.findAll();
		return ResponseEntity.ok(ventas);
	}

	@GetMapping("/usuario/{usuarioId}")
	public ResponseEntity<List<Venta>> obtenerVentasPorUsuario(@PathVariable Integer usuarioId) {
		List<Venta> ventas = ventaService.findByUsuarioId(usuarioId);
		return ResponseEntity.ok(ventas);
	}

	@GetMapping("/rango-fechas")
	public ResponseEntity<List<Venta>> obtenerVentasPorRangoFechas(
			@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date fechaInicio,
			@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date fechaFin) {
		List<Venta> ventas = ventaService.findByFechaBetween(fechaInicio, fechaFin);
		return ResponseEntity.ok(ventas);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Venta> obtenerVentaPorId(@PathVariable Integer id) {
		return ventaService.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
	}

	@PostMapping
	public ResponseEntity<Venta> crearVenta(@RequestBody Venta venta) {
		Venta nuevaVenta = ventaService.save(venta);
		return ResponseEntity.ok(nuevaVenta);
	}

	@PutMapping("/{id}")
	public ResponseEntity<Venta> actualizarVenta(@PathVariable Integer id, @RequestBody Venta venta) {
		if (!ventaService.findById(id).isPresent()) {
			return ResponseEntity.notFound().build();
		}
		venta.setId(id);
		Venta ventaActualizada = ventaService.update(venta);
		return ResponseEntity.ok(ventaActualizada);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminarVenta(@PathVariable Integer id) {
		if (!ventaService.findById(id).isPresent()) {
			return ResponseEntity.notFound().build();
		}
		ventaService.deleteById(id);
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/usuario/{usuarioId}/total")
	public ResponseEntity<Double> obtenerTotalVentasPorUsuario(@PathVariable Integer usuarioId) {
		Double total = ventaService.sumTotalByUsuarioId(usuarioId);
		return ResponseEntity.ok(total != null ? total : 0.0);
	}
}
