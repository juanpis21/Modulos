package com.clinicpet.demo.controller;

import com.clinicpet.demo.model.Mascota;
import com.clinicpet.demo.service.IMascotaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mascotas")
public class MascotaApiController {

	@Autowired
	private IMascotaService mascotaService;

	@GetMapping
	public ResponseEntity<List<Mascota>> listarTodasLasMascotas() {
		List<Mascota> mascotas = mascotaService.listarMascotas();
		return ResponseEntity.ok(mascotas);
	}

	@GetMapping("/usuario/{usuarioId}")
	public ResponseEntity<List<Mascota>> obtenerMascotasPorUsuario(@PathVariable Integer usuarioId) {
		List<Mascota> mascotas = mascotaService.buscarPorUsuario(usuarioId);
		return ResponseEntity.ok(mascotas);
	}

	@GetMapping("/especie/{especie}")
	public ResponseEntity<List<Mascota>> obtenerMascotasPorEspecie(@PathVariable String especie) {
		List<Mascota> mascotas = mascotaService.buscarPorEspecie(especie);
		return ResponseEntity.ok(mascotas);
	}

	@GetMapping("/{id}/historial")
	public ResponseEntity<List<Object>> obtenerHistorialMascota(@PathVariable Integer id) {
		if (!mascotaService.buscarMascotaPorId(id).isPresent()) {
			return ResponseEntity.notFound().build();
		}
		// TODO: Implementar lógica de historial médico cuando esté disponible
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/{id}/tratamientos")
	public ResponseEntity<List<Object>> obtenerTratamientosMascota(@PathVariable Integer id) {
		if (!mascotaService.buscarMascotaPorId(id).isPresent()) {
			return ResponseEntity.notFound().build();
		}
		// TODO: Implementar lógica de tratamientos cuando esté disponible
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/{id}")
	public ResponseEntity<Mascota> obtenerMascota(@PathVariable Integer id) {
		return mascotaService.buscarMascotaPorId(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
	}
}
