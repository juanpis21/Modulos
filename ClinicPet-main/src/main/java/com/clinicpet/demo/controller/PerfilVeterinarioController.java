package com.clinicpet.demo.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.clinicpet.demo.model.Cita;
import com.clinicpet.demo.model.Emergencia;
import com.clinicpet.demo.model.Evento;
import com.clinicpet.demo.model.Inventario;
import com.clinicpet.demo.model.Mascota;
import com.clinicpet.demo.model.PerfilVeterinario;
import com.clinicpet.demo.model.Producto;
import com.clinicpet.demo.model.Usuario;
import com.clinicpet.demo.model.Veterinaria;
import com.clinicpet.demo.service.*;

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/perfil-veterinario")
public class PerfilVeterinarioController {

	@Autowired
	private IPerfilVeterinarioService perfilVeterinarioService;

	@Autowired
	private IProductoService productoService;

	@Autowired
	private IMascotaService mascotaService;

	@Autowired
	private ICitaService citaService;

	@Autowired
	private HttpSession session;

	@Autowired
	private IInventarioService inventarioService;

	@Autowired
	private IVeterinariaService veterinariaService;

	@Autowired
	private IEmergenciaService emergenciaService;

	@Autowired
	private IUsuarioService usuarioService;

	@Autowired
	private IEventoService eventoService;

	// ==================== VISTA PRINCIPAL ====================
	@GetMapping
	public String mostrarPerfilVeterinario(HttpSession session, Model model,
			@RequestParam(required = false) String categoria, @RequestParam(required = false) String estado) {
		System.out.println(" Accediendo a vista principal del veterinario");

		// USAR SESIÓN
		Usuario usuarioLogueado = (Usuario) session.getAttribute("usuarioLogueado");
		if (usuarioLogueado == null) {
			System.out.println(" Usuario no autenticado - Redirigiendo al login");
			return "redirect:/usuarios/iniciarsesion";
		}

		// Verificar si es veterinario
		if (usuarioLogueado.getRol().getId() != 2) {
			System.out.println(" Usuario no tiene rol de veterinario");
			return "redirect:/acceso-denegado";
		}

		String correo = usuarioLogueado.getCorreo();
		System.out.println(" Buscando perfil para: " + correo);

		// Buscar perfil veterinario
		Optional<PerfilVeterinario> perfilOpt = perfilVeterinarioService.buscarPorUsuarioId(usuarioLogueado.getId());
		Veterinaria veterinaria = null;
		Integer veterinariaId = null;

		if (perfilOpt.isPresent()) {
			PerfilVeterinario perfil = perfilOpt.get();
			model.addAttribute("perfilVeterinario", perfil);
			veterinaria = perfil.getVeterinaria();
			if (veterinaria != null) {
				veterinariaId = veterinaria.getId();
				model.addAttribute("veterinaria", veterinaria);
				System.out.println(
						" Perfil veterinario encontrado para: " + correo + " - Veterinaria ID: " + veterinariaId);
			} else {
				System.out.println(" Perfil veterinario sin veterinaria asociada");
			}
		} else {
			System.out.println(" ERROR: Veterinario sin perfil en BD: " + correo);
			model.addAttribute("error", "Error: Perfil de veterinario no encontrado.");
		}

		// Cargar mascotas (MANTENIDO)
		List<Mascota> mascotas = mascotaService.listarMascotas();
		System.out.println(" Mascotas encontradas: " + mascotas.size());
		model.addAttribute("mascotas", mascotas);

		// Cargar eventos de la veterinaria del veterinario logueado
		List<Evento> eventosVet = new ArrayList<>();
		if (veterinariaId != null) {
			List<Evento> todosEventos = eventoService.obtenerTodosLosEventos();
			for (Evento ev : todosEventos) {
				if (ev.getVeterinaria() != null && ev.getVeterinaria().getId() != null
						&& ev.getVeterinaria().getId().equals(veterinariaId)) {
					eventosVet.add(ev);
				}
			}
			// Ordenar eventos por ID descendente (los más recientes primero)
			eventosVet.sort(Comparator.comparing(Evento::getId).reversed());
		}
		System.out.println(" Eventos encontrados para veterinaria " + veterinariaId + ": " + eventosVet.size());
		model.addAttribute("eventosVet", eventosVet);

		// CARGAR PRODUCTOS PARA PET SHOP FILTRADOS POR VETERINARIA
		try {
			System.out.println(" Cargando productos para Pet Shop...");

			if (veterinariaId == null) {
				System.out.println(" No se encontró veterinaria asociada al perfil. No se cargarán productos.");
				model.addAttribute("productos", new ArrayList<Producto>());
				model.addAttribute("inventarioPorProducto", new HashMap<Integer, Inventario>());
			} else {
				List<Producto> productos = productoService.obtenerTodosLosProductos();
				System.out.println(" Productos encontrados: " + productos.size());

				// Obtener inventario SOLO de la veterinaria del perfil
				List<Inventario> inventarios = inventarioService.obtenerInventarioPorVeterinaria(veterinariaId);
				System.out.println(
						" Registros de inventario para veterinaria " + veterinariaId + ": " + inventarios.size());

				// Crear mapa de inventario
				Map<Integer, Inventario> inventarioPorProducto = new HashMap<>();
				for (Inventario inventario : inventarios) {
					if (inventario.getProducto() != null) {
						inventarioPorProducto.put(inventario.getProducto().getId(), inventario);
					}
				}

				// Aplicar filtros de categoría y estado si vienen en la petición
				List<Producto> productosFiltrados = new ArrayList<>();
				for (Producto p : productos) {
					// SOLO considerar productos que tengan inventario en esta veterinaria
					if (!inventarioPorProducto.containsKey(p.getId())) {
						continue;
					}

					boolean coincide = true;

					if (categoria != null && !categoria.isEmpty()
							&& !"Todas las categorías".equalsIgnoreCase(categoria)) {
						if (p.getCategoria() == null || !p.getCategoria().equalsIgnoreCase(categoria)) {
							coincide = false;
						}
					}

					if (coincide && estado != null && !estado.isEmpty() && !"Todos".equalsIgnoreCase(estado)) {
						Inventario inv = inventarioPorProducto.get(p.getId());
						String estadoInv = (inv != null && inv.getEstado() != null) ? inv.getEstado() : "agotado";

						if ("Disponible".equalsIgnoreCase(estado) && !"disponible".equalsIgnoreCase(estadoInv)) {
							coincide = false;
						} else if ("Agotado".equalsIgnoreCase(estado) && "disponible".equalsIgnoreCase(estadoInv)) {
							coincide = false;
						}
					}

					if (coincide) {
						productosFiltrados.add(p);
					}
				}

				model.addAttribute("productos", productosFiltrados);
				model.addAttribute("inventarioPorProducto", inventarioPorProducto);
				model.addAttribute("categoriaSeleccionada", categoria);
				model.addAttribute("estadoSeleccionado", estado);
				System.out.println(
						" Pet Shop cargado correctamente con filtros aplicados para veterinaria " + veterinariaId);
			}

		} catch (Exception e) {
			System.out.println(" Error cargando Pet Shop: " + e.getMessage());
			model.addAttribute("productos", new ArrayList<>());
			model.addAttribute("inventarioPorProducto", new HashMap<>());
		}

		return "perfil-veterinario/perfil-veterinario";
	}

	@GetMapping("/productos/filtrar")
	@ResponseBody
	public Map<String, Object> filtrarProductos(@RequestParam(required = false) String categoria,
			@RequestParam(required = false) String estado) {
		Map<String, Object> response = new HashMap<>();
		try {
			System.out.println(" Filtro AJAX - categoria: " + categoria + ", estado: " + estado);

			// Obtener usuario y perfil para conocer la veterinaria
			Usuario usuarioLogueado = (Usuario) session.getAttribute("usuarioLogueado");
			if (usuarioLogueado == null) {
				response.put("error", "Usuario no autenticado");
				return response;
			}

			Optional<PerfilVeterinario> perfilOpt = perfilVeterinarioService
					.buscarPorUsuarioId(usuarioLogueado.getId());
			if (perfilOpt.isEmpty() || perfilOpt.get().getVeterinaria() == null) {
				response.put("error", "Perfil de veterinario o veterinaria no encontrados");
				return response;
			}

			Integer veterinariaId = perfilOpt.get().getVeterinaria().getId();
			System.out.println(" Filtro AJAX para veterinaria ID: " + veterinariaId);

			// Productos solo de esta veterinaria (a partir del inventario)
			List<Inventario> inventarios = inventarioService.obtenerInventarioPorVeterinaria(veterinariaId);
			Map<Integer, Inventario> inventarioPorProducto = new HashMap<>();
			List<Producto> productos = productoService.obtenerTodosLosProductos();

			for (Inventario inventario : inventarios) {
				if (inventario.getProducto() != null) {
					Integer prodId = inventario.getProducto().getId();
					inventarioPorProducto.put(prodId, inventario);
				}
			}

			List<Map<String, Object>> listaFiltrada = new ArrayList<>();
			for (Producto p : productos) {
				// SOLO considerar productos que tengan inventario en esta veterinaria
				if (!inventarioPorProducto.containsKey(p.getId())) {
					continue;
				}

				boolean coincide = true;

				if (categoria != null && !categoria.isEmpty() && !"Todas las categorías".equalsIgnoreCase(categoria)) {
					if (p.getCategoria() == null || !p.getCategoria().equalsIgnoreCase(categoria)) {
						coincide = false;
					}
				}

				Inventario inv = inventarioPorProducto.get(p.getId());
				String estadoInv = (inv != null && inv.getEstado() != null) ? inv.getEstado() : "agotado";

				if (coincide && estado != null && !estado.isEmpty() && !"Todos".equalsIgnoreCase(estado)) {
					if ("Disponible".equalsIgnoreCase(estado) && !"disponible".equalsIgnoreCase(estadoInv)) {
						coincide = false;
					} else if ("Agotado".equalsIgnoreCase(estado) && "disponible".equalsIgnoreCase(estadoInv)) {
						coincide = false;
					}
				}

				if (coincide) {
					Map<String, Object> item = new HashMap<>();
					item.put("id", p.getId());
					item.put("nombre", p.getNombre());
					item.put("descripcion", p.getDescripcion());
					item.put("precio", p.getPrecio());
					item.put("categoria", p.getCategoria());
					item.put("imagen", p.getImagen());
					item.put("cantidadDisponible", inv != null ? inv.getCantidadDisponible() : 0);
					item.put("estado", estadoInv);
					listaFiltrada.add(item);
				}
			}

			response.put("productos", listaFiltrada);
			System.out.println(" Filtro AJAX - productos retornados: " + listaFiltrada.size());
		} catch (Exception e) {
			System.err.println(" Error en filtro AJAX: " + e.getMessage());
			response.put("error", e.getMessage());
		}
		return response;
	}

	// ==================== OTRAS SECCIONES (PLACEHOLDERS) ====================
	@GetMapping("/inicio")
	public String inicio() {
		return "perfil-veterinario/inicio";
	}

	@GetMapping("/agenda")
	public String agenda(Model model) {
		return "perfil-veterinario/agenda";
	}

	@GetMapping("/historias-clinicas")
	public String historiasClinicas() {
		return "perfil-veterinario/historias-clinicas";
	}

	@GetMapping("/adopciones")
	public String adopciones() {
		return "perfil-veterinario/adopciones";
	}

	// ==================== SECCION CONFIGURACION ====================
	@PostMapping("/configuracion/actualizar")
	public String actualizarConfiguracion(
			@RequestParam(value = "foto", required = false) MultipartFile fotoFile,
			@RequestParam(value = "usuario.nombres", required = false) String nombres,
			@RequestParam(value = "usuario.apellidos", required = false) String apellidos,
			@RequestParam(value = "usuario.telefono", required = false) String telefono,
			@RequestParam(value = "usuario.direccion", required = false) String direccion,
			@RequestParam(value = "experiencia", required = false) String experiencia,
			HttpSession session,
			RedirectAttributes redirectAttributes) {
		
		System.out.println(" Procesando actualización de configuración");

		Usuario usuarioLogueado = (Usuario) session.getAttribute("usuarioLogueado");
		if (usuarioLogueado == null) {
			System.out.println(" Usuario no autenticado");
			return "redirect:/usuarios/iniciarsesion";
		}

		try {
			if (usuarioLogueado.getRol().getId() != 2) {
				redirectAttributes.addFlashAttribute("error", "No tiene permisos de veterinario");
				return "redirect:/perfil-veterinario";
			}

			Optional<PerfilVeterinario> perfilOpt = perfilVeterinarioService.buscarPorUsuarioId(usuarioLogueado.getId());
			if (perfilOpt.isEmpty()) {
				redirectAttributes.addFlashAttribute("error", "Perfil no encontrado");
				return "redirect:/perfil-veterinario";
			}

			PerfilVeterinario perfilExistente = perfilOpt.get();

			// Actualizar datos del usuario
			if (nombres != null && !nombres.trim().isEmpty()) {
				usuarioLogueado.setNombres(nombres);
			}
			if (apellidos != null && !apellidos.trim().isEmpty()) {
				usuarioLogueado.setApellidos(apellidos);
			}
			if (telefono != null && !telefono.trim().isEmpty()) {
				usuarioLogueado.setTelefono(telefono);
			}
			if (direccion != null && !direccion.trim().isEmpty()) {
				usuarioLogueado.setDireccion(direccion);
			}

			// Manejo de foto
			if (fotoFile != null && !fotoFile.isEmpty()) {
				if (fotoFile.getSize() > 10 * 1024 * 1024) {
					redirectAttributes.addFlashAttribute("error", "La imagen no debe superar 10MB");
					return "redirect:/perfil-veterinario";
				}

				String contentType = fotoFile.getContentType();
				if (contentType == null || (!contentType.equals("image/jpeg") && !contentType.equals("image/png"))) {
					redirectAttributes.addFlashAttribute("error", "Formato no válido. Solo JPG y PNG");
					return "redirect:/perfil-veterinario";
				}

				String uploadDir = System.getProperty("user.dir") + "/uploads/";
				File dir = new File(uploadDir);
				if (!dir.exists()) {
					dir.mkdirs();
				}

				String extension = contentType.equals("image/jpeg") ? ".jpg" : ".png";
				String fileName = "vet_" + usuarioLogueado.getId() + "_" + System.currentTimeMillis() + extension;
				Path filePath = Paths.get(uploadDir + fileName);

				Files.copy(fotoFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
				usuarioLogueado.setImagen("/uploads/" + fileName);
			}

			// Actualizar experiencia en el perfil
			if (experiencia != null && !experiencia.trim().isEmpty()) {
				perfilExistente.setExperiencia(experiencia);
			}

			// Guardar cambios
			Usuario usuarioGuardado = usuarioService.actualizarUsuario(usuarioLogueado.getId(), usuarioLogueado);
			perfilVeterinarioService.actualizarPerfil(perfilExistente.getId(), perfilExistente);

			// Actualizar sesión
			session.setAttribute("usuarioLogueado", usuarioGuardado);

			redirectAttributes.addFlashAttribute("success", " Perfil actualizado correctamente");
			return "redirect:/perfil-veterinario";

		} catch (Exception e) {
			System.out.println(" Error al actualizar perfil: " + e.getMessage());
			e.printStackTrace();
			redirectAttributes.addFlashAttribute("error", "Error al actualizar perfil: " + e.getMessage());
			return "redirect:/perfil-veterinario";
		}
	}

	// MODAL CITA!!!!!!!!!!!!!
	@GetMapping("/perfil-veterinario")
	public String nuevaCita(Model model) {

		List<Mascota> mascotas = mascotaService.listarMascotas();
		model.addAttribute("mascotas", mascotas);
		return "perfil-veterinario/perfil-veterinario"; // tu vista que tiene el modal
	}

	// ==================== MODAL CREAR EVENTO ====================
	@PostMapping("/evento/guardar")
	public String guardarEvento(@RequestParam("nombre") String nombre,
			@RequestParam("descripcion") String descripcion,
			@RequestParam("fechainicio") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechainicio,
			@RequestParam("fechafin") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechafin,
			@RequestParam("fileImagen") MultipartFile fileImagen,
			HttpSession session,
			RedirectAttributes redirectAttributes) {

		try {
			Usuario usuarioLogueado = (Usuario) session.getAttribute("usuarioLogueado");
			if (usuarioLogueado == null) {
				redirectAttributes.addFlashAttribute("error", "Debe iniciar sesión como veterinario");
				return "redirect:/usuarios/iniciarsesion";
			}

			Optional<PerfilVeterinario> perfilOpt = perfilVeterinarioService.buscarPorUsuarioId(usuarioLogueado.getId());
			if (perfilOpt.isEmpty() || perfilOpt.get().getVeterinaria() == null) {
				redirectAttributes.addFlashAttribute("error", "No se encontró veterinaria asociada al perfil");
				return "redirect:/perfil-veterinario";
			}

			Veterinaria veterinaria = perfilOpt.get().getVeterinaria();

			Evento evento = new Evento();
			evento.setTitulo(nombre);
			evento.setDescripcion(descripcion);
			evento.setFechainicio(fechainicio);
			evento.setFechafin(fechafin);
			evento.setVeterinaria(veterinaria);

			// Manejo de imagen del evento
			if (fileImagen != null && !fileImagen.isEmpty()) {
				String uploadsDir = System.getProperty("user.dir") + "/uploads/";
				String nombreOriginal = fileImagen.getOriginalFilename();
				String extension = (nombreOriginal != null && nombreOriginal.contains("."))
						? nombreOriginal.substring(nombreOriginal.lastIndexOf("."))
						: "";
				String nombreArchivo = System.currentTimeMillis() + "_evento_"
						+ (nombre.replaceAll("[^a-zA-Z0-9]", "_").toLowerCase()) + extension;

				Path rutaCompleta = Paths.get(uploadsDir + nombreArchivo);
				Files.createDirectories(rutaCompleta.getParent());
				fileImagen.transferTo(rutaCompleta.toFile());

				evento.setImagen("/uploads/" + nombreArchivo);
			}

			eventoService.guardarEvento(evento);
			redirectAttributes.addFlashAttribute("success", "Evento creado correctamente");
			return "redirect:/perfil-veterinario";

		} catch (Exception e) {
			redirectAttributes.addFlashAttribute("error", "Error al crear el evento: " + e.getMessage());
			return "redirect:/perfil-veterinario";
		}
	}

	// MODAL DE AGREGAR PRODUCTO!!!!!!!!!!!!!!
	@PostMapping("/producto/guardar")
	public String guardarProducto(@RequestParam("nombre") String nombre, @RequestParam("precio") Double precio,
			@RequestParam("categoria") String categoria, @RequestParam("descripcion") String descripcion,
			@RequestParam("fileImagen") MultipartFile imagen,
			@RequestParam("cantidadDisponible") Integer cantidadDisponible,
			@RequestParam("idveterinaria") Integer idVeterinaria, // Hacerlo REQUERIDO
			Model model) {

		try {
			System.out.println("=== INICIANDO GUARDAR PRODUCTO ===");
			System.out.println("🔍 ID Veterinaria recibido: " + idVeterinaria);

			// VALIDACIÓN BÁSICA
			if (idVeterinaria == null || idVeterinaria <= 0) {
				throw new RuntimeException("ID de veterinaria inválido: " + idVeterinaria);
			}

			if (cantidadDisponible == null || cantidadDisponible < 0) {
				cantidadDisponible = 0;
			}

			System.out.println(
					"📝 Datos recibidos - Veterinaria: " + idVeterinaria + ", Cantidad: " + cantidadDisponible);

			// 1. Crear y guardar el producto

			System.out.println("🔍 Buscando producto existente...");

			Producto productoGuardado;
			Optional<Producto> productoExistente = productoService.buscarPorNombreYCategoria(nombre.trim(), categoria);

			if (productoExistente.isPresent()) {
				// ✅ PRODUCTO EXISTENTE - ACTUALIZARLO con los nuevos datos
				productoGuardado = productoExistente.get();
				System.out.println("📦 Producto existente encontrado, ID: " + productoGuardado.getId());

				// ACTUALIZAR los campos que pueden cambiar
				productoGuardado.setPrecio(precio); // ✅ Actualizar precio
				productoGuardado.setDescripcion(descripcion != null ? descripcion.trim() : ""); // ✅ Actualizar
																								// descripción

				// ACTUALIZAR imagen solo si se subió una nueva
				if (imagen != null && !imagen.isEmpty()) {
					try {
						String uploadsDir = System.getProperty("user.dir") + "/uploads/";
						String nombreOriginal = imagen.getOriginalFilename();
						String extension = nombreOriginal.contains(".")
								? nombreOriginal.substring(nombreOriginal.lastIndexOf("."))
								: "";

						String nombreArchivo = System.currentTimeMillis() + "_"
								+ (nombre.replaceAll("[^a-zA-Z0-9]", "_").toLowerCase()) + extension;

						Path rutaCompleta = Paths.get(uploadsDir + nombreArchivo);
						Files.createDirectories(rutaCompleta.getParent());
						imagen.transferTo(rutaCompleta.toFile());

						productoGuardado.setImagen("/uploads/" + nombreArchivo); // ✅ Actualizar imagen
						System.out.println("🖼️ Nueva imagen guardada: " + productoGuardado.getImagen());

					} catch (IOException e) {
						System.err.println("❌ Error al guardar nueva imagen: " + e.getMessage());
					}
				} else {
					System.out.println("📷 No se subió nueva imagen, se mantiene la anterior");
				}

				// Guardar los cambios del producto actualizado
				productoGuardado = productoService.actualizarProducto(productoGuardado);
				System.out.println("🔄 Producto actualizado - Precio: " + productoGuardado.getPrecio());

			} else {
				// 🆕 PRODUCTO NUEVO - Crearlo (tu código actual)
				System.out.println("🆕 Creando nuevo producto...");
				Producto producto = new Producto();
				producto.setNombre(nombre.trim());
				producto.setPrecio(precio);
				producto.setCategoria(categoria);
				producto.setDescripcion(descripcion != null ? descripcion.trim() : "");

				// Guardar imagen (tu código actual)
				if (imagen != null && !imagen.isEmpty()) {
					try {
						String uploadsDir = System.getProperty("user.dir") + "/uploads/";
						String nombreOriginal = imagen.getOriginalFilename();
						String extension = nombreOriginal.contains(".")
								? nombreOriginal.substring(nombreOriginal.lastIndexOf("."))
								: "";

						String nombreArchivo = System.currentTimeMillis() + "_"
								+ (nombre.replaceAll("[^a-zA-Z0-9]", "_").toLowerCase()) + extension;

						Path rutaCompleta = Paths.get(uploadsDir + nombreArchivo);
						Files.createDirectories(rutaCompleta.getParent());
						imagen.transferTo(rutaCompleta.toFile());

						producto.setImagen("/uploads/" + nombreArchivo);
						System.out.println("🖼️ Imagen guardada: " + producto.getImagen());

					} catch (IOException e) {
						System.err.println("❌ Error al guardar imagen: " + e.getMessage());
					}
				}

				productoGuardado = productoService.crearProducto(producto);
				System.out.println("✅ Nuevo producto guardado con ID: " + productoGuardado.getId());
			}

			// 2. Obtener veterinaria de la base de datos (tu código actual)
			System.out.println("🔍 Buscando veterinaria en BD con ID: " + idVeterinaria);
			Veterinaria veterinaria = veterinariaService.obtenerPorId(idVeterinaria).orElseThrow(
					() -> new RuntimeException("Veterinaria no encontrada en BD con ID: " + idVeterinaria));
			System.out.println("✅ Veterinaria encontrada: " + veterinaria.getNombre());

			// 3. GESTIÓN DE INVENTARIO (tu código actual corregido)
			System.out.println("🔄 Procesando inventario...");

			// Buscar inventario existente para ESTE producto en ESTA veterinaria
			Inventario inventarioExistente = inventarioService.obtenerInventarioPorVeterinariaYProducto(idVeterinaria,
					productoGuardado.getId());

			Inventario inventario;

			if (inventarioExistente != null) {
				System.out.println("📦 Inventario existente encontrado, ID: " + inventarioExistente.getId());
				System.out.println("📦 Producto: " + inventarioExistente.getProducto().getNombre());
				System.out.println("📦 Cantidad actual: " + inventarioExistente.getCantidadDisponible());
				System.out.println("📦 Nueva cantidad a agregar: " + cantidadDisponible);

				// ✅ USAR EL MÉTODO DEL SERVICE PARA AGREGAR STOCK
				inventario = inventarioService.agregarStock(inventarioExistente.getId(), cantidadDisponible);
				System.out.println("🔄 Stock actualizado - Nueva cantidad: " + inventario.getCantidadDisponible());
			} else {
				System.out.println("🆕 Creando NUEVO registro de inventario...");

				inventario = new Inventario();
				inventario.setProducto(productoGuardado);
				inventario.setVeterinaria(veterinaria);
				inventario.setCantidadDisponible(cantidadDisponible);
				inventario.setFechaActualizacion(LocalDate.now());
				inventario.actualizarEstado();

				System.out.println("📊 Antes de guardar - Producto ID: " + inventario.getProducto().getId());
				System.out.println("📊 Antes de guardar - Veterinaria ID: " + inventario.getVeterinaria().getId());
				System.out.println("📊 Antes de guardar - Cantidad: " + inventario.getCantidadDisponible());

				try {
					Inventario inventarioGuardado = inventarioService.guardarInventario(inventario);

					if (inventarioGuardado != null && inventarioGuardado.getId() != null) {
						System.out.println("✅ NUEVO inventario guardado con ID: " + inventarioGuardado.getId());
						inventario = inventarioGuardado;
					} else {
						throw new RuntimeException("El inventario no se guardó correctamente - ID es null");
					}

				} catch (Exception e) {
					System.err.println("💥 ERROR CRÍTICO al guardar inventario: " + e.getMessage());
					e.printStackTrace();
					throw new RuntimeException("Error al guardar en inventario: " + e.getMessage(), e);
				}
			}

			// 4. VERIFICACIÓN FINAL
			System.out.println("=== VERIFICACIÓN FINAL ===");
			System.out.println("🔍 Producto ID: " + productoGuardado.getId());
			System.out.println("🔍 Veterinaria ID: " + idVeterinaria);
			System.out.println("🔍 Inventario ID: " + inventario.getId());
			System.out.println("🔍 Cantidad en inventario: " + inventario.getCantidadDisponible());
			System.out.println("🔍 Estado: " + inventario.getEstado());

			System.out.println("🎉 PROCESO COMPLETADO EXITOSAMENTE");
			return "redirect:/perfil-veterinario?success=true";

		} catch (Exception e) {
			System.err.println("💥 ERROR CRÍTICO al guardar producto: " + e.getMessage());
			e.printStackTrace();
			return "redirect:/perfil-veterinario?error=" + e.getMessage();
		}
	}

	@GetMapping("/producto/datos/{idProducto}")
	@ResponseBody
	public Map<String, Object> obtenerDatosProducto(@PathVariable Integer idProducto) {
		Map<String, Object> response = new HashMap<>();

		try {
			System.out.println("🔍 Obteniendo datos del producto ID: " + idProducto);

			// 1) Obtener usuario logueado desde la sesión
			Usuario usuarioLogueado = (Usuario) session.getAttribute("usuarioLogueado");
			if (usuarioLogueado == null) {
				response.put("error", "Usuario no autenticado");
				System.err.println("❌ Usuario no autenticado al obtener datos de producto");
				return response;
			}

			// 2) Obtener perfil del veterinario y su veterinaria
			Optional<PerfilVeterinario> perfilOpt = perfilVeterinarioService
					.buscarPorUsuarioId(usuarioLogueado.getId());
			if (perfilOpt.isEmpty() || perfilOpt.get().getVeterinaria() == null) {
				response.put("error", "Perfil de veterinario o veterinaria no encontrados");
				System.err.println("❌ Perfil de veterinario o veterinaria no encontrados para usuario ID: "
						+ usuarioLogueado.getId());
				return response;
			}
			Integer veterinariaId = perfilOpt.get().getVeterinaria().getId();
			System.out.println("🔍 Obteniendo inventario para veterinaria ID: " + veterinariaId);

			// 3) Obtener producto
			Optional<Producto> productoOpt = productoService.obtenerProductoPorId(idProducto);
			if (productoOpt.isPresent()) {
				Producto producto = productoOpt.get();

				// 4) Inventario del producto en ESTA veterinaria
				Inventario inventario = inventarioService.obtenerInventarioPorVeterinariaYProducto(veterinariaId,
						idProducto);

				response.put("id", producto.getId());
				response.put("nombre", producto.getNombre());
				response.put("descripcion", producto.getDescripcion());
				response.put("precio", producto.getPrecio());
				response.put("categoria", producto.getCategoria());
				response.put("imagen", producto.getImagen());
				response.put("cantidadDisponible", inventario != null ? inventario.getCantidadDisponible() : 0);

				System.out.println("✅ Datos cargados para producto: " + producto.getNombre()
						+ " | Cantidad inventario: " + (inventario != null ? inventario.getCantidadDisponible() : 0));
			} else {
				response.put("error", "Producto no encontrado");
				System.err.println("❌ Producto no encontrado ID: " + idProducto);
			}
		} catch (Exception e) {
			response.put("error", "Error: " + e.getMessage());
			System.err.println("💥 Error al obtener datos del producto: " + e.getMessage());
		}

		return response;
	}

	@PostMapping("/producto/actualizar/{idProducto}")
	public String actualizarProducto(@PathVariable Integer idProducto, @RequestParam String nombre,
			@RequestParam Double precio, @RequestParam(required = false) String categoria,
			@RequestParam String descripcion, @RequestParam Integer cantidadDisponible,
			@RequestParam(required = false) MultipartFile imagen, @RequestParam Integer idveterinaria) {

		try {
			System.out.println("🔄 Actualizando producto ID: " + idProducto);

			// Verificar que el producto existe
			Optional<Producto> productoExistenteOpt = productoService.obtenerProductoPorId(idProducto);
			if (productoExistenteOpt.isEmpty()) {
				throw new RuntimeException("Producto no encontrado con ID: " + idProducto);
			}

			Producto producto = productoExistenteOpt.get();

			// ✅ Actualizar campos, incluyendo nombre y categoría
			producto.setNombre(nombre != null ? nombre.trim() : producto.getNombre());
			if (categoria != null && !categoria.trim().isEmpty()) {
				producto.setCategoria(categoria.trim());
			}
			producto.setPrecio(precio);
			producto.setDescripcion(descripcion != null ? descripcion.trim() : "");

			// Actualizar imagen solo si se subió una nueva
			if (imagen != null && !imagen.isEmpty()) {
				try {
					String uploadsDir = System.getProperty("user.dir") + "/uploads/";
					String nombreOriginal = imagen.getOriginalFilename();
					String extension = nombreOriginal.contains(".")
							? nombreOriginal.substring(nombreOriginal.lastIndexOf("."))
							: "";

					String nombreArchivo = System.currentTimeMillis() + "_"
							+ (nombre.replaceAll("[^a-zA-Z0-9]", "_").toLowerCase()) + extension;

					Path rutaCompleta = Paths.get(uploadsDir + nombreArchivo);
					Files.createDirectories(rutaCompleta.getParent());
					imagen.transferTo(rutaCompleta.toFile());

					producto.setImagen("/uploads/" + nombreArchivo);
					System.out.println("🖼️ Nueva imagen guardada: " + producto.getImagen());

				} catch (IOException e) {
					System.err.println("❌ Error al guardar nueva imagen: " + e.getMessage());
				}
			}

			// Guardar producto actualizado
			Producto productoActualizado = productoService.actualizarProducto(producto);
			System.out.println("✅ Producto actualizado: " + productoActualizado.getNombre());

			// Actualizar inventario
			Inventario inventario = inventarioService.obtenerInventarioPorVeterinariaYProducto(idveterinaria,
					idProducto);
			if (inventario != null) {
				inventario.setCantidadDisponible(cantidadDisponible);
				inventario.setFechaActualizacion(LocalDate.now());
				inventario.actualizarEstado();
				inventarioService.guardarInventario(inventario);
				System.out.println("📦 Inventario actualizado - Cantidad: " + cantidadDisponible);
			} else {
				// Crear nuevo registro de inventario si no existe
				Veterinaria veterinaria = veterinariaService.obtenerPorId(idveterinaria)
						.orElseThrow(() -> new RuntimeException("Veterinaria no encontrada"));

				Inventario nuevoInventario = new Inventario();
				nuevoInventario.setProducto(productoActualizado);
				nuevoInventario.setVeterinaria(veterinaria);
				nuevoInventario.setCantidadDisponible(cantidadDisponible);
				nuevoInventario.setFechaActualizacion(LocalDate.now());
				nuevoInventario.actualizarEstado();

				inventarioService.guardarInventario(nuevoInventario);
				System.out.println("📦 Nuevo inventario creado - Cantidad: " + cantidadDisponible);
			}

			System.out.println("🎉 Producto actualizado exitosamente");
			return "redirect:/perfil-veterinario?success=Producto actualizado correctamente";

		} catch (Exception e) {
			System.err.println("💥 Error al actualizar producto: " + e.getMessage());
			e.printStackTrace();
			return "redirect:/perfil-veterinario?error=" + e.getMessage();
		}
	}

	@PostMapping("/producto/eliminar/{idProducto}")
	public String eliminarProducto(@PathVariable Integer idProducto, RedirectAttributes redirectAttributes) {
		try {
			System.out.println("🗑️ Eliminando producto ID: " + idProducto);

			// Eliminar registros de inventario asociados al producto
			List<Inventario> inventarios = inventarioService.obtenerInventarioPorProducto(idProducto);
			for (Inventario inv : inventarios) {
				System.out.println("🗑️ Eliminando inventario ID: " + inv.getId());
				inventarioService.eliminarInventario(inv.getId());
			}

			// Eliminar el producto
			productoService.eliminarProducto(idProducto);
			System.out.println("✅ Producto eliminado correctamente");
			redirectAttributes.addFlashAttribute("success", "Producto eliminado correctamente");
		} catch (Exception e) {
			System.err.println("💥 Error al eliminar producto: " + e.getMessage());
			redirectAttributes.addFlashAttribute("error", "Error al eliminar producto: " + e.getMessage());
		}

		return "redirect:/perfil-veterinario";
	}

	@GetMapping("/evento/datos/{idEvento}")
	@ResponseBody
	public Map<String, Object> obtenerDatosEvento(@PathVariable Integer idEvento) {
		Map<String, Object> response = new HashMap<>();
		
		try {
			System.out.println("🔍 Obteniendo datos del evento ID: " + idEvento);
			
			// Verificar usuario autenticado
			Usuario usuarioLogueado = (Usuario) session.getAttribute("usuarioLogueado");
			if (usuarioLogueado == null) {
				response.put("error", "Usuario no autenticado");
				System.err.println("❌ Usuario no autenticado al obtener datos de evento");
				return response;
			}
			
			// Obtener evento
			Optional<Evento> eventoOpt = eventoService.obtenerEventoPorId(idEvento);
			if (eventoOpt.isPresent()) {
				Evento evento = eventoOpt.get();
				
				response.put("id", evento.getId());
				response.put("titulo", evento.getTitulo());
				response.put("descripcion", evento.getDescripcion());
				response.put("fechainicio", evento.getFechainicio().toString());
				response.put("fechafin", evento.getFechafin().toString());
				response.put("imagen", evento.getImagen());
				
				System.out.println("✅ Datos cargados para evento: " + evento.getTitulo());
			} else {
				response.put("error", "Evento no encontrado");
				System.err.println("❌ Evento no encontrado ID: " + idEvento);
			}
		} catch (Exception e) {
			response.put("error", "Error: " + e.getMessage());
			System.err.println("💥 Error al obtener datos del evento: " + e.getMessage());
		}
		
		return response;
	}
	
	@PostMapping("/evento/actualizar/{idEvento}")
	public String actualizarEvento(
			@PathVariable Integer idEvento,
			@RequestParam("nombre") String nombre,
			@RequestParam("descripcion") String descripcion,
			@RequestParam("fechainicio") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechainicio,
			@RequestParam("fechafin") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechafin,
			@RequestParam(value = "fileImagen", required = false) MultipartFile fileImagen,
			HttpSession session,
			RedirectAttributes redirectAttributes) {
		
		try {
			System.out.println("🔄 Actualizando evento ID: " + idEvento);
			
			// Verificar usuario autenticado
			Usuario usuarioLogueado = (Usuario) session.getAttribute("usuarioLogueado");
			if (usuarioLogueado == null) {
				redirectAttributes.addFlashAttribute("error", "Debe iniciar sesión como veterinario");
				return "redirect:/usuarios/iniciarsesion";
			}
			
			// Verificar que el evento existe
			Optional<Evento> eventoExistenteOpt = eventoService.obtenerEventoPorId(idEvento);
			if (eventoExistenteOpt.isEmpty()) {
				redirectAttributes.addFlashAttribute("error", "Evento no encontrado");
				return "redirect:/perfil-veterinario";
			}
			
			Evento evento = eventoExistenteOpt.get();
			
			// Actualizar campos
			evento.setTitulo(nombre);
			evento.setDescripcion(descripcion);
			evento.setFechainicio(fechainicio);
			evento.setFechafin(fechafin);
			
			// Actualizar imagen solo si se subió una nueva
			if (fileImagen != null && !fileImagen.isEmpty()) {
				String uploadsDir = System.getProperty("user.dir") + "/uploads/";
				String nombreOriginal = fileImagen.getOriginalFilename();
				String extension = (nombreOriginal != null && nombreOriginal.contains("."))
						? nombreOriginal.substring(nombreOriginal.lastIndexOf("."))
						: "";
				String nombreArchivo = System.currentTimeMillis() + "_evento_"
						+ (nombre.replaceAll("[^a-zA-Z0-9]", "_").toLowerCase()) + extension;
				
				Path rutaCompleta = Paths.get(uploadsDir + nombreArchivo);
				Files.createDirectories(rutaCompleta.getParent());
				fileImagen.transferTo(rutaCompleta.toFile());
				
				evento.setImagen("/uploads/" + nombreArchivo);
				System.out.println("🖼️ Nueva imagen guardada: " + evento.getImagen());
			}
			
			// Guardar evento actualizado
			eventoService.guardarEvento(evento);
			System.out.println("✅ Evento actualizado correctamente: " + evento.getTitulo());
			
			redirectAttributes.addFlashAttribute("success", "Evento actualizado correctamente");
			return "redirect:/perfil-veterinario";
			
		} catch (Exception e) {
			System.err.println("💥 Error al actualizar evento: " + e.getMessage());
			e.printStackTrace();
			redirectAttributes.addFlashAttribute("error", "Error al actualizar el evento: " + e.getMessage());
			return "redirect:/perfil-veterinario";
		}
	}

	/**
	 * Eliminar un evento
	 */
	@PostMapping("/evento/eliminar/{idEvento}")
	public String eliminarEvento(
			@PathVariable Integer idEvento,
			HttpSession session,
			RedirectAttributes redirectAttributes) {
		
		try {
			System.out.println("🗑️ Eliminando evento ID: " + idEvento);
			
			// Verificar usuario autenticado
			Usuario usuarioLogueado = (Usuario) session.getAttribute("usuarioLogueado");
			if (usuarioLogueado == null) {
				redirectAttributes.addFlashAttribute("error", "Debe iniciar sesión como veterinario");
				return "redirect:/usuarios/iniciarsesion";
			}
			
			// Verificar que el evento existe
			Optional<Evento> eventoOpt = eventoService.obtenerEventoPorId(idEvento);
			if (eventoOpt.isEmpty()) {
				redirectAttributes.addFlashAttribute("error", "Evento no encontrado");
				return "redirect:/perfil-veterinario";
			}
			
			// Eliminar el evento
			eventoService.eliminarEvento(idEvento);
			System.out.println("✅ Evento eliminado correctamente");
			
			redirectAttributes.addFlashAttribute("success", "Evento eliminado correctamente");
			return "redirect:/perfil-veterinario";
			
		} catch (Exception e) {
			System.err.println("💥 Error al eliminar evento: " + e.getMessage());
			e.printStackTrace();
			redirectAttributes.addFlashAttribute("error", "Error al eliminar el evento: " + e.getMessage());
			return "redirect:/perfil-veterinario";
		}
	}

	/**
	 * Eliminar cuenta del veterinario (perfil + usuario)
	 */
	@PostMapping("/configuracion/eliminar-cuenta")
	public String eliminarCuentaVeterinario(
			HttpSession session,
			RedirectAttributes redirectAttributes) {
		
		try {
			System.out.println("🗑️ Iniciando eliminación de cuenta de veterinario");
			
			// Verificar usuario autenticado
			Usuario usuarioLogueado = (Usuario) session.getAttribute("usuarioLogueado");
			if (usuarioLogueado == null) {
				System.out.println("❌ Usuario no autenticado");
				redirectAttributes.addFlashAttribute("error", "Debe iniciar sesión");
				return "redirect:/usuarios/iniciarsesion";
			}
			
			// Verificar que es veterinario (rol 2)
			if (usuarioLogueado.getRol().getId() != 2) {
				System.out.println("❌ Usuario no tiene rol de veterinario");
				redirectAttributes.addFlashAttribute("error", "No tiene permisos de veterinario");
				return "redirect:/acceso-denegado";
			}
			
			Integer usuarioId = usuarioLogueado.getId();
			System.out.println("🔍 Eliminando cuenta de usuario ID: " + usuarioId);
			
			// Eliminar perfil veterinario y usuario
			perfilVeterinarioService.eliminarPerfilYUsuario(usuarioId);
			
			// Limpiar sesión
			session.invalidate();
			System.out.println("✅ Cuenta eliminada correctamente y sesión cerrada");
			redirectAttributes.addFlashAttribute("success", "Cuenta eliminada correctamente");
			return "redirect:/usuarios/iniciarsesion";
			
		} catch (Exception e) {
			System.err.println("💥 Error al eliminar cuenta: " + e.getMessage());
			e.printStackTrace();
			redirectAttributes.addFlashAttribute("error", "Error al eliminar la cuenta: " + e.getMessage());
			return "redirect:/perfil-veterinario";
		}
	}

	/**
	 * Obtener estadísticas del dashboard (contadores)
	 */
	@GetMapping("/dashboard/estadisticas")
	@ResponseBody
	public Map<String, Object> obtenerEstadisticasDashboard(HttpSession session) {
		Map<String, Object> response = new HashMap<>();
		
		try {
			System.out.println("📊 Obteniendo estadísticas del dashboard");
			
			// Verificar usuario autenticado
			Usuario usuarioLogueado = (Usuario) session.getAttribute("usuarioLogueado");
			if (usuarioLogueado == null) {
				response.put("error", "Usuario no autenticado");
				return response;
			}
			
			// Obtener perfil veterinario y veterinaria
			Optional<PerfilVeterinario> perfilOpt = perfilVeterinarioService.buscarPorUsuarioId(usuarioLogueado.getId());
			if (perfilOpt.isEmpty() || perfilOpt.get().getVeterinaria() == null) {
				response.put("error", "Perfil de veterinario o veterinaria no encontrados");
				return response;
			}
			
			Integer veterinariaId = perfilOpt.get().getVeterinaria().getId();
			System.out.println("🏥 Obteniendo estadísticas para veterinaria ID: " + veterinariaId);
			
			// Contar productos en inventario de la veterinaria
			List<Inventario> inventarios = inventarioService.obtenerInventarioPorVeterinaria(veterinariaId);
			int totalProductos = inventarios.size();
			
			System.out.println("📦 Total de productos en inventario: " + totalProductos);
			
			// Agregar estadísticas al response
			response.put("totalProductos", totalProductos);
			response.put("success", true);
			
			return response;
			
		} catch (Exception e) {
			System.err.println("💥 Error al obtener estadísticas: " + e.getMessage());
			e.printStackTrace();
			response.put("error", "Error al obtener estadísticas: " + e.getMessage());
			return response;
		}
	}

}