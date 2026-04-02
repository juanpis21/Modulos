package com.clinicpet.demo.controller;

import com.clinicpet.demo.model.Usuario;
import com.clinicpet.demo.model.Cita;
import com.clinicpet.demo.model.Venta;
import com.clinicpet.demo.model.Mascota;
import com.clinicpet.demo.service.IUsuarioService;
import com.clinicpet.demo.service.ICitaService;
import com.clinicpet.demo.service.IVentaService;
import com.clinicpet.demo.service.IMascotaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioApiController {

	@Autowired
	private IUsuarioService usuarioService;

	@Autowired
	private ICitaService citaService;

	@Autowired
	private IVentaService ventaService;

	@Autowired
	private IMascotaService mascotaService;

	@GetMapping("/{id}/perfil")
	public ResponseEntity<Usuario> obtenerPerfilUsuario(@PathVariable Integer id) {
		return usuarioService.buscarUsuarioPorId(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
	}

	@PutMapping("/{id}/perfil")
	public ResponseEntity<Usuario> actualizarPerfilUsuario(@PathVariable Integer id, @RequestBody Usuario usuario) {
		if (!usuarioService.buscarUsuarioPorId(id).isPresent()) {
			return ResponseEntity.notFound().build();
		}
		usuario.setId(id);
		Usuario usuarioActualizado = usuarioService.actualizarUsuario(id, usuario);
		return ResponseEntity.ok(usuarioActualizado);
	}

	// Endpoint para obtener citas de un usuario
	@GetMapping("/{id}/citas")
	public ResponseEntity<List<Cita>> obtenerCitasUsuario(@PathVariable Integer id) {
		if (!usuarioService.buscarUsuarioPorId(id).isPresent()) {
			return ResponseEntity.notFound().build();
		}
		List<Cita> citas = citaService.buscarPorUsuario(id);
		if (citas.isEmpty()) {
			return ResponseEntity.noContent().build();
		}
		return ResponseEntity.ok(citas);
	}

	// Endpoint para obtener compras/ventas de un usuario
	@GetMapping("/{id}/compras")
	public ResponseEntity<List<Venta>> obtenerComprasUsuario(@PathVariable Integer id) {
		if (!usuarioService.buscarUsuarioPorId(id).isPresent()) {
			return ResponseEntity.notFound().build();
		}
		List<Venta> compras = ventaService.findByUsuarioId(id);
		if (compras.isEmpty()) {
			return ResponseEntity.noContent().build();
		}
		return ResponseEntity.ok(compras);
	}

	// Endpoint para obtener detalle de una compra específica
	@GetMapping("/{id}/compras/{compraId}")
	public ResponseEntity<Venta> obtenerDetalleCompra(@PathVariable Integer id, @PathVariable Integer compraId) {
		if (!usuarioService.buscarUsuarioPorId(id).isPresent()) {
			return ResponseEntity.notFound().build();
		}
		return ventaService.findById(compraId).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
	}

	// Endpoint para obtener mascotas de un usuario
	@GetMapping("/{id}/mascotas")
	public ResponseEntity<List<Mascota>> obtenerMascotasUsuario(@PathVariable Integer id) {
		if (!usuarioService.buscarUsuarioPorId(id).isPresent()) {
			return ResponseEntity.notFound().build();
		}
		List<Mascota> mascotas = mascotaService.buscarPorUsuario(id);
		if (mascotas.isEmpty()) {
			return ResponseEntity.noContent().build();
		}
		return ResponseEntity.ok(mascotas);
	}

	// Endpoints adicionales que el JavaScript está intentando llamar
	// Por ahora retornan 204 (No Content) para evitar errores

	@GetMapping("/{id}/adopciones")
	public ResponseEntity<List<Object>> obtenerAdopcionesUsuario(@PathVariable Integer id) {
		if (!usuarioService.buscarUsuarioPorId(id).isPresent()) {
			return ResponseEntity.notFound().build();
		}
		// TODO: Implementar lógica de adopciones cuando esté disponible
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/{id}/reportes")
	public ResponseEntity<List<Object>> obtenerReportesUsuario(@PathVariable Integer id) {
		if (!usuarioService.buscarUsuarioPorId(id).isPresent()) {
			return ResponseEntity.notFound().build();
		}
		// TODO: Implementar lógica de reportes cuando esté disponible
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/{id}/opiniones")
	public ResponseEntity<List<Object>> obtenerOpinionesUsuario(@PathVariable Integer id) {
		if (!usuarioService.buscarUsuarioPorId(id).isPresent()) {
			return ResponseEntity.notFound().build();
		}
		// TODO: Implementar lógica de opiniones cuando esté disponible
		return ResponseEntity.noContent().build();
	}
}
