package com.clinicpet.demo.controller;

import com.clinicpet.demo.model.Mascota;
import com.clinicpet.demo.model.PerfilAdmin;
import com.clinicpet.demo.model.PerfilVeterinario;
import com.clinicpet.demo.model.ReporteMaltrato;
import com.clinicpet.demo.model.Rol;
import com.clinicpet.demo.model.Usuario;
import com.clinicpet.demo.model.Veterinaria;
import com.clinicpet.demo.repository.IMascotaRepository;
import com.clinicpet.demo.repository.IPerfilVeterinarioRepository;
import com.clinicpet.demo.repository.IReporteDeMaltratoRepository;
import com.clinicpet.demo.repository.IRolRepository;
import com.clinicpet.demo.repository.IUsuarioRepository;
import com.clinicpet.demo.repository.IVeterinariaRepository;
import com.clinicpet.demo.service.HistoriaClinicaServiceImplement;
import com.clinicpet.demo.service.IPerfilAdminService;
import com.clinicpet.demo.service.IReporteMaltratoService;
import com.clinicpet.demo.service.VeterinariaServiceImplement;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/admin")
public class PerfilAdminController {

	// ==========================
	// INYECCIONES
	// ==========================

	private final VeterinariaServiceImplement veterinariaServiceImplement;
	private final HistoriaClinicaServiceImplement historiaClinicaServiceImplement;

	@Autowired
	private IPerfilAdminService adminService;
	@Autowired
	private IUsuarioRepository usuarioRepo;
	@Autowired
	private IMascotaRepository mascotaRepo;
	@Autowired
	private IRolRepository rolRepository;
	@Autowired
	private IPerfilVeterinarioRepository veterinarioRepo;
	@Autowired
	private IVeterinariaRepository veterinariaRepo;
	@Autowired
	private IReporteDeMaltratoRepository reporteRepo;
	@Autowired
	private IReporteMaltratoService reporteMaltratoService;

	PerfilAdminController(HistoriaClinicaServiceImplement historiaClinicaServiceImplement,
			VeterinariaServiceImplement veterinariaServiceImplement) {
		this.historiaClinicaServiceImplement = historiaClinicaServiceImplement;
		this.veterinariaServiceImplement = veterinariaServiceImplement;
	}

	// ==========================
	// PANEL PRINCIPAL
	// ==========================

	@GetMapping
	public String mostrarPanelAdmin(Model model, HttpSession session,
			@RequestParam(required = false) Integer verUsuario, @RequestParam(required = false) Integer verMascota,
			@RequestParam(required = false) Integer verVeterinario,
			@RequestParam(required = false) Integer verVeterinaria,
			@RequestParam(required = false) Integer verReporte) {

		try {
			System.out.println("Accediendo a /admin - Cargando datos desde BD");

			PerfilAdmin admin = obtenerAdminLogueado(session);
			model.addAttribute("admin", admin);

			cargarDatosDashboard(model);
			cargarUsuariosParaVista(model);
			cargarVeterinariasParaVista(model);
			cargarMascotasParaVista(model);
			cargarReportesParaVista(model);

			if (verUsuario != null) {
				usuarioRepo.findById(verUsuario).ifPresent(u -> {
					model.addAttribute("detalleUsuario", u);
					model.addAttribute("mostrarModal", "usuario");
				});
			}

			if (verMascota != null) {
				mascotaRepo.findById(verMascota).ifPresent(m -> {
					model.addAttribute("detalleMascota", m);
					model.addAttribute("mostrarModal", "mascota");
				});
			}

			if (verVeterinario != null) {
				veterinarioRepo.findById(verVeterinario).ifPresent(v -> {
					model.addAttribute("detalleVeterinario", v);
					model.addAttribute("mostrarModal", "veterinario");
				});
			}

			if (verVeterinaria != null) {
				veterinariaRepo.findById(verVeterinaria).ifPresent(v -> {
					model.addAttribute("detalleVeterinaria", v);
					model.addAttribute("mostrarModal", "veterinaria");
				});
			}

			if (verReporte != null) {
				reporteMaltratoService.obtenerReporteMaltratoPorId(verReporte).ifPresent(r -> {
					model.addAttribute("detalleReporte", r);
					model.addAttribute("mostrarModal", "reporte");
				});
			}

			System.out.println("Datos cargados correctamente desde BD");
			return "admin/panelAdmin";

		} catch (Exception e) {
			System.out.println("Error en mostrarPanelAdmin: " + e.getMessage());
			e.printStackTrace();
			model.addAttribute("error", "Error al cargar el panel de administración");
			return "redirect:/usuarios/iniciarsesion";
		}
	}

	// ==========================
	// REGISTROS
	// ==========================

	@PostMapping("/veterinarios/registrar")
	public String registrarVeterinario(@RequestParam String nombres, @RequestParam String apellidos,
			@RequestParam Integer edad, @RequestParam String correo, @RequestParam String telefono,
			@RequestParam String especialidad, @RequestParam String tarjetaProfesional,
			@RequestParam String experiencia, @RequestParam String password, @RequestParam String tipoDocumento,
			@RequestParam String numDocumento, @RequestParam String direccion,
			@RequestParam(required = false) Integer veterinariaId, HttpSession session,
			RedirectAttributes redirectAttributes) {

		if (!verificarSesionAdmin(session)) {
			return "redirect:/usuarios/iniciarsesion";
		}

		try {
			System.out.println("REGISTRANDO VETERINARIO EN BD: " + nombres + " " + apellidos);

			if (usuarioRepo.existsByCorreo(correo)) {
				redirectAttributes.addFlashAttribute("error", "El correo ya está registrado");
				return "redirect:/admin#users";
			}

			if (usuarioRepo.existsByNumDocumento(numDocumento)) {
				redirectAttributes.addFlashAttribute("error", "El numero de documento ya está registrado");
				return "redirect:/admin#users";
			}

			Optional<Rol> rolOpt = rolRepository.findById(2);
			if (rolOpt.isEmpty()) {
				redirectAttributes.addFlashAttribute("error", "Rol VETERINARIO no encontrado");
				return "redirect:/admin#users";
			}

			Usuario usuario = new Usuario();
			usuario.setNombres(nombres);
			usuario.setApellidos(apellidos);
			usuario.setCorreo(correo);
			usuario.setTelefono(telefono);
			usuario.setPassword(password);
			usuario.setEdad(edad);
			usuario.setTipoDocumento(tipoDocumento);
			usuario.setNumDocumento(numDocumento);
			usuario.setDireccion(direccion);
			usuario.setActivo(true);
			usuario.setRol(rolOpt.get());

			Usuario usuarioGuardado = usuarioRepo.save(usuario);

			PerfilVeterinario veterinario = new PerfilVeterinario();
			veterinario.setUsuario(usuarioGuardado);
			veterinario.setEspecialidad(especialidad);
			veterinario.setTarjetaProfesional(tarjetaProfesional);
			veterinario.setExperiencia(experiencia);
			veterinario.setEstado(true);

			// ✅ ASIGNAR VETERINARIA SI FUE SELECCIONADA
			if (veterinariaId != null && veterinariaId > 0) {
				Optional<Veterinaria> veterinariaOpt = veterinariaRepo.findById(veterinariaId);
				if (veterinariaOpt.isPresent()) {
					veterinario.setVeterinaria(veterinariaOpt.get());
					System.out.println("✅ Veterinaria asignada: " + veterinariaOpt.get().getNombre());
				} else {
					System.out.println("⚠️ Veterinaria con ID " + veterinariaId + " no encontrada");
				}
			} else {
				System.out.println("ℹ️ No se seleccionó veterinaria para este veterinario");
			}

			veterinarioRepo.save(veterinario);

			redirectAttributes.addFlashAttribute("mensaje", "Veterinario registrado correctamente");

		} catch (Exception e) {
			e.printStackTrace();
			redirectAttributes.addFlashAttribute("error", "Error al registrar veterinario: " + e.getMessage());
		}

		return "redirect:/admin#users";
	}

	@PostMapping("/veterinarias/registrar")
	public String registrarVeterinaria(@RequestParam String nombre, @RequestParam String rut,
			@RequestParam String direccion, @RequestParam String telefono, @RequestParam String correo,
			@RequestParam String horario, @RequestParam String descripcion, @RequestParam String estado,
			HttpSession session, RedirectAttributes redirectAttributes) {

		if (!verificarSesionAdmin(session)) {
			return "redirect:/usuarios/iniciarsesion";
		}

		try {
			Veterinaria veterinaria = new Veterinaria();
			veterinaria.setNombre(nombre);
			veterinaria.setRut(rut);
			veterinaria.setDireccion(direccion);
			veterinaria.setTelefono(telefono);
			veterinaria.setCorreo(correo);
			veterinaria.setHorario(horario);
			veterinaria.setDescripcion(descripcion);
			veterinaria.setEstado(estado);

			veterinariaRepo.save(veterinaria);

			redirectAttributes.addFlashAttribute("mensaje", "Veterinaria registrada correctamente");

		} catch (Exception e) {
			redirectAttributes.addFlashAttribute("error", "Error al registrar veterinaria: " + e.getMessage());
		}

		return "redirect:/admin#vets";
	}

	// ==========================
	// PERFIL ADMIN
	// ==========================

	@PostMapping("/perfil/editar")
	public String guardarPerfil(@RequestParam String nombres, @RequestParam String correo,
			@RequestParam String telefono, HttpSession session, RedirectAttributes redirectAttributes) {

		if (!verificarSesionAdmin(session)) {
			return "redirect:/usuarios/iniciarsesion";
		}

		try {
			Optional<PerfilAdmin> adminOptional = adminService.buscarPorId(1);

			if (adminOptional.isPresent()) {
				PerfilAdmin adminActual = adminOptional.get();
				adminActual.setNombres(nombres);
				adminActual.setCorreo(correo);
				adminActual.setTelefono(telefono);

				adminService.guardar(adminActual);

				redirectAttributes.addFlashAttribute("mensaje", "Perfil actualizado correctamente");
			} else {
				redirectAttributes.addFlashAttribute("error", "Administrador no encontrado");
			}

		} catch (Exception e) {
			redirectAttributes.addFlashAttribute("error", "Error al actualizar el perfil");
		}

		return "redirect:/admin#profile";
	}

	@PostMapping("/perfil/imagen")
	public String subirImagen(@RequestParam("imagen") MultipartFile archivoImagen, HttpSession session,
			RedirectAttributes redirectAttributes) {

		if (!verificarSesionAdmin(session)) {
			return "redirect:/usuarios/iniciarsesion";
		}

		try {
			if (archivoImagen.isEmpty()) {
				redirectAttributes.addFlashAttribute("error", "El archivo está vacío");
				return "redirect:/admin#profile";
			}

			String contentType = archivoImagen.getContentType();
			if (contentType == null || !contentType.startsWith("image/")) {
				redirectAttributes.addFlashAttribute("error", "El archivo debe ser una imagen (JPG, PNG, etc.)");
				return "redirect:/admin#profile";
			}

			Usuario usuarioLogueado = (Usuario) session.getAttribute("usuarioLogueado");
			Optional<PerfilAdmin> adminOpt = adminService.buscarPorUsuarioId(usuarioLogueado.getId());

			if (adminOpt.isEmpty()) {
				redirectAttributes.addFlashAttribute("error", "Perfil de administrador no encontrado");
				return "redirect:/admin#profile";
			}

			PerfilAdmin admin = adminOpt.get();

			String uploadsDir = System.getProperty("user.dir") + "/uploads/";
			File uploadDir = new File(uploadsDir);

			if (!uploadDir.exists())
				uploadDir.mkdirs();

			String originalFilename = archivoImagen.getOriginalFilename();
			String fileExtension = originalFilename != null
					? originalFilename.substring(originalFilename.lastIndexOf("."))
					: ".jpg";

			String newFilename = "admin_" + admin.getId() + "_" + System.currentTimeMillis() + fileExtension;

			String relativePath = "/uploads/" + newFilename;
			String filePath = uploadsDir + newFilename;

			File dest = new File(filePath);
			archivoImagen.transferTo(dest);

			admin.setImagen(relativePath);
			adminService.guardar(admin);

			admin = adminService.buscarPorId(admin.getId()).orElseThrow();
			session.setAttribute("admin", admin);

			redirectAttributes.addFlashAttribute("mensaje", "Imagen actualizada correctamente");

		} catch (IOException e) {
			redirectAttributes.addFlashAttribute("error", "Error al guardar la imagen: " + e.getMessage());
		} catch (Exception e) {
			redirectAttributes.addFlashAttribute("error", "Error inesperado: " + e.getMessage());
		}

		return "redirect:/admin#profile";
	}

	// ==========================
	// LISTADOS
	// ==========================

	@GetMapping("/mascotas")
	public String verGestionMascotas(Model model) {
		cargarDatosDashboard(model);
		model.addAttribute("mascotas", mascotaRepo.findAll());
		return "admin/panelAdmin :: #mascotas";
	}

	// ==========================
	// CAMBIAR ESTADOS
	// ==========================

	@PostMapping("/usuario/cambiar-estado/{id}")
	public String cambiarEstadoUsuario(@PathVariable Integer id, @RequestParam boolean activo,
			RedirectAttributes redirectAttributes) {

		Optional<Usuario> opt = usuarioRepo.findById(id);

		if (opt.isPresent()) {
			Usuario u = opt.get();
			u.setActivo(activo);
			usuarioRepo.save(u);
			redirectAttributes.addFlashAttribute("mensaje", "Usuario " + (activo ? "desactivado" : "activado"));
		} else {
			redirectAttributes.addFlashAttribute("error", "Usuario no encontrado");
		}

		return "redirect:/admin#users";
	}

	@PostMapping("/veterinaria/cambiar-estado/{id}")
	public String cambiarEstadoVeterinaria(@PathVariable Integer id, @RequestParam boolean estado,
			RedirectAttributes redirectAttributes) {

		Optional<Veterinaria> opt = veterinariaRepo.findById(id);

		if (opt.isPresent()) {
			Veterinaria v = opt.get();
			v.setEstado(estado ? "Activa" : "Inactiva");
			veterinariaRepo.save(v);

			redirectAttributes.addFlashAttribute("mensaje", "Veterinaria " + (estado ? "activada" : "desactivada"));
		} else {
			redirectAttributes.addFlashAttribute("error", "Veterinaria no encontrada");
		}

		return "redirect:/admin#vets";
	}

	// ==========================
	// UTILIDADES PRIVADAS
	// ==========================

	private void cargarUsuariosParaVista(Model model) {
		List<Usuario> usuarios = usuarioRepo.findAll().stream()
				.filter(u -> !"admin@helpyourpet.com".equalsIgnoreCase(u.getCorreo())).toList();

		model.addAttribute("usuarios", usuarios);
		System.out.println("✓ " + usuarios.size() + " usuarios cargados desde BD");
	}

	private void cargarVeterinariasParaVista(Model model) {
		List<Veterinaria> veterinarias = veterinariaRepo.findAll();
		model.addAttribute("veterinarias", veterinarias);
		System.out.println("✓ " + veterinarias.size() + " veterinarias cargadas desde BD");
	}

	private void cargarVeterinariosParaVista(Model model) {
		List<PerfilVeterinario> veterinarios = veterinarioRepo.findAll();
		model.addAttribute("veterinarios", veterinarios);
		System.out.println("✓ " + veterinarios.size() + " veterinarios cargados desde BD");
	}

	private void cargarMascotasParaVista(Model model) {
		List<Mascota> mascotas = mascotaRepo.findAll();
		model.addAttribute("mascotas", mascotas);
		System.out.println("mascotas cargadas: " + mascotas.size());
	}

	private void cargarDatosDashboard(Model model) {
		model.addAttribute("totalUsuarios", usuarioRepo.count());
		model.addAttribute("totalMascotas", mascotaRepo.count());
		model.addAttribute("totalVeterinarias", veterinariaRepo.count());
		model.addAttribute("totalReportes", reporteRepo.count());
	}

	private PerfilAdmin obtenerAdminLogueado(HttpSession session) {
		Usuario usuarioLogueado = (Usuario) session.getAttribute("usuarioLogueado");

		if (usuarioLogueado == null || usuarioLogueado.getRol().getId() != 3) {
			throw new RuntimeException("Usuario no autorizado");
		}

		return adminService.buscarPorUsuarioId(usuarioLogueado.getId())
				.orElseThrow(() -> new RuntimeException("Perfil admin no encontrado"));
	}

	private boolean verificarSesionAdmin(HttpSession session) {
		Usuario usuarioLogueado = (Usuario) session.getAttribute("usuarioLogueado");
		return usuarioLogueado != null && usuarioLogueado.getRol().getId() == 3;
	}

	// ==========================
	// METODO PARA CARGAR REPORTES
	// ==========================

	private void cargarReportesParaVista(Model model) {
		List<ReporteMaltrato> reportes = reporteMaltratoService.obtenerTodosLosReportesMaltrato();
		model.addAttribute("reportes", reportes);

		// Contar reportes pendientes para notificaciones
		long reportesPendientes = reportes.stream().filter(r -> "pendiente".equalsIgnoreCase(r.getEstado())).count();
		model.addAttribute("reportesPendientes", reportesPendientes);

		System.out.println("✓ " + reportes.size() + " reportes cargados desde BD");
		System.out.println("✓ " + reportesPendientes + " reportes pendientes");
	}

	// asignar autoridad
	@PostMapping("/reporte/asignar-autoridad/{id}")
	public String asignarAutoridad(@PathVariable Integer id, @RequestParam String autoridad,
			RedirectAttributes redirectAttributes) {
		try {
			Optional<ReporteMaltrato> reporteOpt = reporteMaltratoService.obtenerReporteMaltratoPorId(id);

			if (reporteOpt.isPresent()) {
				ReporteMaltrato reporte = reporteOpt.get();
				String descripcionActual = reporte.getDescripcion();

				// Agregar la autoridad asignada a la descripción
				descripcionActual += "\n\n--- AUTORIDAD ASIGNADA ---\n" + autoridad;
				reporte.setDescripcion(descripcionActual);
				reporte.setEstado("asignado");

				reporteMaltratoService.actualizarReporteMaltrato(id, reporte);
				redirectAttributes.addFlashAttribute("mensaje", "Autoridad asignada correctamente");
			} else {
				redirectAttributes.addFlashAttribute("error", "Reporte no encontrado");
			}
		} catch (Exception e) {
			redirectAttributes.addFlashAttribute("error", "Error al asignar autoridad: " + e.getMessage());
		}

		return "redirect:/admin#pets";
	}

	// cambiar estado del reporte
	@PostMapping("/reporte/cambiar-estado/{id}")
	public String cambiarEstadoReporte(@PathVariable Integer id, @RequestParam String estado,
			RedirectAttributes redirectAttributes) {
		try {
			Optional<ReporteMaltrato> reporteOpt = reporteMaltratoService.obtenerReporteMaltratoPorId(id);

			if (reporteOpt.isPresent()) {
				ReporteMaltrato reporte = reporteOpt.get();
				reporte.setEstado(estado);

				reporteMaltratoService.actualizarReporteMaltrato(id, reporte);
				redirectAttributes.addFlashAttribute("mensaje", "Estado actualizado a: " + estado);
			} else {
				redirectAttributes.addFlashAttribute("error", "Reporte no encontrado");
			}
		} catch (Exception e) {
			redirectAttributes.addFlashAttribute("error", "Error al cambiar estado: " + e.getMessage());
		}

		return "redirect:/admin#pets";
	}

	// ==========================
	// LOGOUT
	// ==========================

		@GetMapping("/logout")
		public String cerrarSesion(HttpSession session, RedirectAttributes redirectAttributes) {
			session.invalidate(); // Destruye la sesión
			redirectAttributes.addFlashAttribute("mensaje", "Sesión cerrada correctamente");
			return "redirect:/";
		}
}
