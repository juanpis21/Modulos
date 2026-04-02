package com.clinicpet.demo.controller;

import com.clinicpet.demo.model.ReporteMaltrato;
import com.clinicpet.demo.model.Usuario;
import com.clinicpet.demo.service.IReporteMaltratoService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.File;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/reportes")
public class ReporteMaltratoController {

	@Autowired
	private IReporteMaltratoService reporteMaltratoService;

	// ==================== MOSTRAR FORMULARIO ====================
	@GetMapping("/maltrato")
	public String mostrarFormularioReporte(Model model, HttpSession session) {
		Usuario usuarioLogueado = (Usuario) session.getAttribute("usuarioLogueado");
		if (usuarioLogueado != null) {
			model.addAttribute("usuario", usuarioLogueado);
		}
		return "reporteMaltrato";
	}

	// ==================== CREATE - CREAR REPORTE ====================
	@PostMapping("/maltrato/enviar")
	public String enviarReporteMaltrato(@RequestParam String animalType,
			@RequestParam(required = false) String otherAnimal, @RequestParam Integer affectedAnimals,
			@RequestParam String abuseDescription, @RequestParam String location, @RequestParam String dateTime,
			@RequestParam(required = false) String accusedName, @RequestParam(required = false) boolean anonymous,
			@RequestParam(required = false) String reporterName, @RequestParam(required = false) String reporterPhone,
			@RequestParam(required = false) String reporterEmail,
			@RequestParam(required = false) List<String> abuseCategories,
			@RequestParam(required = false) String otherAbuseDescription,
			@RequestParam(required = false) MultipartFile[] evidence,
			@RequestParam(required = false) String additionalInfo, HttpSession session,
			RedirectAttributes redirectAttributes) {

		try {
			Usuario usuarioLogueado = (Usuario) session.getAttribute("usuarioLogueado");

			ReporteMaltrato reporte = new ReporteMaltrato();

			// Configurar datos básicos
			reporte.setFecha(LocalDate.now());

			// Construir descripción completa
			StringBuilder descripcionCompleta = new StringBuilder();
			descripcionCompleta.append("TIPO DE ANIMAL: ").append(animalType);
			if ("otro".equals(animalType) && otherAnimal != null) {
				descripcionCompleta.append(" (").append(otherAnimal).append(")");
			}
			descripcionCompleta.append("\nNÚMERO DE ANIMALES: ").append(affectedAnimals);
			descripcionCompleta.append("\n\nDESCRIPCIÓN: ").append(abuseDescription);
			descripcionCompleta.append("\n\nLUGAR: ").append(location);
			descripcionCompleta.append("\nFECHA/HORA DEL INCIDENTE: ").append(dateTime);

			if (accusedName != null && !accusedName.trim().isEmpty()) {
				descripcionCompleta.append("\nDENUNCIADO: ").append(accusedName);
			}

			if (!anonymous) {
				descripcionCompleta.append("\n\n--- DATOS DEL DENUNCIANTE ---");
				if (reporterName != null)
					descripcionCompleta.append("\nNombre: ").append(reporterName);
				if (reporterPhone != null)
					descripcionCompleta.append("\nTeléfono: ").append(reporterPhone);
				if (reporterEmail != null)
					descripcionCompleta.append("\nEmail: ").append(reporterEmail);
			} else {
				descripcionCompleta.append("\n\nREPORTE ANÓNIMO");
			}

			if (abuseCategories != null && !abuseCategories.isEmpty()) {
				descripcionCompleta.append("\n\nCATEGORÍAS DE MALTRATO: ").append(String.join(", ", abuseCategories));
				if (abuseCategories.contains("otros") && otherAbuseDescription != null) {
					descripcionCompleta.append(" - ").append(otherAbuseDescription);
				}
			}

			if (additionalInfo != null && !additionalInfo.trim().isEmpty()) {
				descripcionCompleta.append("\n\nINFORMACIÓN ADICIONAL: ").append(additionalInfo);
			}

			// Procesar evidencias si existen
			if (evidence != null && evidence.length > 0) {
				descripcionCompleta.append("\n\nEVIDENCIAS ADJUNTAS: ").append(evidence.length).append(" archivo(s)");

				String uploadsDir = System.getProperty("user.dir") + "/uploads/reportes/";
				File uploadDir = new File(uploadsDir);
				if (!uploadDir.exists())
					uploadDir.mkdirs();

				for (MultipartFile file : evidence) {
					if (!file.isEmpty()) {
						String filename = "reporte_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
						file.transferTo(new File(uploadsDir + filename));
					}
				}
			}

			reporte.setDescripcion(descripcionCompleta.toString());
			reporte.setEstado("pendiente");
			reporte.setUsuario(usuarioLogueado);

			reporteMaltratoService.crearReporteMaltrato(reporte);

			redirectAttributes.addFlashAttribute("mensaje",
					"Reporte enviado exitosamente. Será revisado a la brevedad.");
			return "redirect:/reportes/maltrato";

		} catch (Exception e) {
			e.printStackTrace();
			redirectAttributes.addFlashAttribute("error", "Error al enviar el reporte: " + e.getMessage());
			return "redirect:/reportes/maltrato";
		}
	}

	// ==================== READ - LISTAR TODOS LOS REPORTES ====================
	@GetMapping("/listar")
	public String listarReportes(Model model) {
		try {
			List<ReporteMaltrato> reportes = reporteMaltratoService.obtenerTodosLosReportesMaltrato();
			model.addAttribute("reportes", reportes);
			return "admin/listaReportes";
		} catch (Exception e) {
			model.addAttribute("error", "Error al cargar reportes: " + e.getMessage());
			return "redirect:/admin";
		}
	}

	// ==================== READ - OBTENER UN REPORTE POR ID ====================
	@GetMapping("/ver/{id}")
	public String verReporte(@PathVariable Integer id, Model model, RedirectAttributes redirectAttributes) {
		try {
			Optional<ReporteMaltrato> reporteOpt = reporteMaltratoService.obtenerReporteMaltratoPorId(id);

			if (reporteOpt.isPresent()) {
				model.addAttribute("reporte", reporteOpt.get());
				return "admin/detalleReporte";
			} else {
				redirectAttributes.addFlashAttribute("error", "Reporte no encontrado");
				return "redirect:/admin#pets";
			}
		} catch (Exception e) {
			redirectAttributes.addFlashAttribute("error", "Error al cargar reporte: " + e.getMessage());
			return "redirect:/admin#pets";
		}
	}

	// ==================== UPDATE - ACTUALIZAR ESTADO ====================
	@PostMapping("/actualizar/{id}")
	public String actualizarReporte(@PathVariable Integer id, @RequestParam String estado,
			@RequestParam(required = false) String notas, RedirectAttributes redirectAttributes) {
		try {
			Optional<ReporteMaltrato> reporteOpt = reporteMaltratoService.obtenerReporteMaltratoPorId(id);

			if (reporteOpt.isPresent()) {
				ReporteMaltrato reporte = reporteOpt.get();
				reporte.setEstado(estado);

				if (notas != null && !notas.trim().isEmpty()) {
					String descripcionActual = reporte.getDescripcion();
					descripcionActual += "\n\n--- NOTAS DE ACTUALIZACIÓN ---\n" + notas;
					reporte.setDescripcion(descripcionActual);
				}

				reporteMaltratoService.actualizarReporteMaltrato(id, reporte);
				redirectAttributes.addFlashAttribute("mensaje", "Reporte actualizado correctamente");
			} else {
				redirectAttributes.addFlashAttribute("error", "Reporte no encontrado");
			}
		} catch (Exception e) {
			redirectAttributes.addFlashAttribute("error", "Error al actualizar reporte: " + e.getMessage());
		}

		return "redirect:/admin#pets";
	}

	// ==================== DELETE - ELIMINAR REPORTE ====================
	@PostMapping("/eliminar/{id}")
	public String eliminarReporte(@PathVariable Integer id, RedirectAttributes redirectAttributes) {
		try {
			Optional<ReporteMaltrato> reporteOpt = reporteMaltratoService.obtenerReporteMaltratoPorId(id);

			if (reporteOpt.isPresent()) {
				reporteMaltratoService.eliminarReporteMaltrato(id);
				redirectAttributes.addFlashAttribute("mensaje", "Reporte eliminado correctamente");
			} else {
				redirectAttributes.addFlashAttribute("error", "Reporte no encontrado");
			}
		} catch (Exception e) {
			redirectAttributes.addFlashAttribute("error", "Error al eliminar reporte: " + e.getMessage());
		}

		return "redirect:/admin#pets";
	}

	// ==================== MÉTODOS ADICIONALES ====================

	// Listar reportes por estado
	@GetMapping("/estado/{estado}")
	public String listarReportesPorEstado(@PathVariable String estado, Model model) {
		try {
			List<ReporteMaltrato> reportes = reporteMaltratoService.obtenerReportesMaltratoPorEstado(estado);
			model.addAttribute("reportes", reportes);
			model.addAttribute("estadoFiltro", estado);
			return "admin/listaReportes";
		} catch (Exception e) {
			model.addAttribute("error", "Error al filtrar reportes: " + e.getMessage());
			return "redirect:/admin#pets";
		}
	}

	// Listar reportes de un usuario específico
	@GetMapping("/usuario/{usuarioId}")
	public String listarReportesPorUsuario(@PathVariable Integer usuarioId, Model model) {
		try {
			List<ReporteMaltrato> reportes = reporteMaltratoService.obtenerReportesMaltratoPorUsuarioId(usuarioId);
			model.addAttribute("reportes", reportes);
			return "admin/listaReportes";
		} catch (Exception e) {
			model.addAttribute("error", "Error al cargar reportes del usuario: " + e.getMessage());
			return "redirect:/admin#pets";
		}
	}

	// Obtener reportes recientes
	@GetMapping("/recientes")
	public String listarReportesRecientes(Model model) {
		try {
			List<ReporteMaltrato> reportes = reporteMaltratoService.obtenerReportesMaltratoRecientes();
			model.addAttribute("reportes", reportes);
			return "admin/listaReportes";
		} catch (Exception e) {
			model.addAttribute("error", "Error al cargar reportes recientes: " + e.getMessage());
			return "redirect:/admin#pets";
		}
	}

	// Buscar reportes por descripción
	@GetMapping("/buscar")
	public String buscarReportes(@RequestParam String texto, Model model) {
		try {
			List<ReporteMaltrato> reportes = reporteMaltratoService.buscarReportesMaltratoPorDescripcion(texto);
			model.addAttribute("reportes", reportes);
			model.addAttribute("textoBusqueda", texto);
			return "admin/listaReportes";
		} catch (Exception e) {
			model.addAttribute("error", "Error en la búsqueda: " + e.getMessage());
			return "redirect:/admin#pets";
		}
	}
}