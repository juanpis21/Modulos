package com.clinicpet.demo.controller;

import com.clinicpet.demo.model.Cita;
import com.clinicpet.demo.service.ICitaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/citas")
public class CitaController {

	@Autowired
	private ICitaService citaService;

	@GetMapping("/usuario/{usuarioId}")
	public ResponseEntity<List<Cita>> obtenerCitasPorUsuario(@PathVariable Integer usuarioId) {
		List<Cita> citas = citaService.buscarPorUsuario(usuarioId);
		return ResponseEntity.ok(citas);
	}

	@GetMapping("/veterinario/{veterinarioId}")
	public ResponseEntity<List<Cita>> obtenerCitasPorVeterinario(@PathVariable Integer veterinarioId) {
		List<Cita> citas = citaService.buscarPorVeterinario(veterinarioId);
		return ResponseEntity.ok(citas);
	}

	@GetMapping("/usuario/{usuarioId}/rango")
	public ResponseEntity<List<Cita>> obtenerCitasPorUsuarioYRango(@PathVariable Integer usuarioId,
			@RequestParam LocalDateTime inicio, @RequestParam LocalDateTime fin) {
		List<Cita> citas = citaService.buscarPorUsuarioYFechaRango(usuarioId, inicio, fin);
		return ResponseEntity.ok(citas);
	}

	@PostMapping
	public ResponseEntity<Cita> crearCita(@RequestBody Cita cita) {
		Cita nuevaCita = citaService.guardarCita(cita);
		return ResponseEntity.ok(nuevaCita);
	}

	@PutMapping("/{id}")
	public ResponseEntity<Cita> actualizarCita(@PathVariable Integer id, @RequestBody Cita cita) {
		if (!citaService.buscarPorId(id).isPresent()) {
			return ResponseEntity.notFound().build();
		}
		cita.setId(id);
		Cita citaActualizada = citaService.guardarCita(cita);
		return ResponseEntity.ok(citaActualizada);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminarCita(@PathVariable Integer id) {
		if (!citaService.buscarPorId(id).isPresent()) {
			return ResponseEntity.notFound().build();
		}
		citaService.eliminarCita(id);
		return ResponseEntity.noContent().build();
	}
}
