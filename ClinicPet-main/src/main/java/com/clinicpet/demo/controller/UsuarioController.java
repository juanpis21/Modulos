package com.clinicpet.demo.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.transaction.annotation.Transactional;

import com.clinicpet.demo.dto.ProductoDTO;
import com.clinicpet.demo.dto.VentaDTO;
import com.clinicpet.demo.dto.VeterinariaDTO;
import com.clinicpet.demo.model.Adopcion;
import com.clinicpet.demo.model.DetalleVenta;
import com.clinicpet.demo.model.Inventario;
import com.clinicpet.demo.model.Mascota;
import com.clinicpet.demo.model.Pago;
import com.clinicpet.demo.model.Producto;
import com.clinicpet.demo.model.Usuario;
import com.clinicpet.demo.model.Venta;
import com.clinicpet.demo.model.Veterinaria;
import com.clinicpet.demo.repository.IEventoRepository;
import com.clinicpet.demo.repository.IInventarioRepository;
import com.clinicpet.demo.repository.IProductoRepository;
import com.clinicpet.demo.repository.IUsuarioRepository;
import com.clinicpet.demo.repository.IVentaRepository;
import com.clinicpet.demo.repository.IVeterinariaRepository;
import com.clinicpet.demo.service.IAdopcionService;
import com.clinicpet.demo.service.IMascotaService;
import com.clinicpet.demo.service.IUsuarioService;
import com.clinicpet.demo.service.PasswordResetService;
import jakarta.mail.MessagingException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/usuarios")
public class UsuarioController {
	private final Logger LOGGER = org.slf4j.LoggerFactory.getLogger(UsuarioController.class);

	@Autowired
	private IUsuarioService usuarioService;

	@Autowired
	private IUsuarioRepository usuarioRepository;

	@Autowired
	private IMascotaService mascotaService;

	@Autowired
	private IVeterinariaRepository veterinariaRepository;

	@Autowired
	private IInventarioRepository inventarioRepository;

	@Autowired
	private IVentaRepository ventaRepository;

	@Autowired
	private IProductoRepository productoRepository;

	@Autowired
	private IEventoRepository eventoRepository;

	@Autowired
	private IAdopcionService adopcionService;

	@Autowired
	private com.clinicpet.demo.service.IInventarioService inventarioService;

	@Autowired
	private com.clinicpet.demo.service.IPerfilVeterinarioService perfilVeterinarioService;

	@Autowired
	private PasswordResetService passwordResetService;

	@Autowired
	private org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder passwordEncoder;

	@Autowired
	private com.clinicpet.demo.service.EmailService emailService;

	@GetMapping("/iniciarsesion")
	public String mostrarLogin(Model model) {
		model.addAttribute("usuarioLogin", new Usuario());
		return "IniciarSesion/iniciarsesion";
	}

	@PostMapping("/iniciarsesion")
	public String procesarLogin(@ModelAttribute Usuario usuarioLogin, Model model, HttpSession session,
			RedirectAttributes redirectAttributes) {
		try {
			Optional<Usuario> usuarioOpt = usuarioService.buscarUsuarioPorCorreo(usuarioLogin.getCorreo());
			if (usuarioOpt.isPresent()) {
				Usuario usuario = usuarioOpt.get();
				boolean passwordValid = false;

				if (usuario.getPassword().startsWith("$2a$") || usuario.getPassword().startsWith("$2b$")) {
					passwordValid = passwordEncoder.matches(usuarioLogin.getPassword(), usuario.getPassword());
				} else {
					passwordValid = usuario.getPassword().equals(usuarioLogin.getPassword());

					if (passwordValid) {
						String contrasenaEncriptada = passwordEncoder.encode(usuarioLogin.getPassword());
						usuario.setPassword(contrasenaEncriptada);
						usuarioRepository.save(usuario);
						LOGGER.info("Contrasena migrada a BCrypt para usuario: {}", usuario.getCorreo());
					}
				}

				if (passwordValid && usuario.isActivo()) {
					session.setAttribute("usuarioLogueado", usuario);
					redirectAttributes.addFlashAttribute("mensaje", "Bienvenido, " + usuario.getNombres());

					Integer rolId = usuario.getRol().getId();

					if (rolId == 3) {
						return "redirect:/admin";
					} else if (rolId == 2) {
						return "redirect:/perfil-veterinario";
					} else {
						return "redirect:/usuarios/inicio";
					}
				}
			}
			model.addAttribute("error", "Correo o contrasena incorrectos, o usuario inactivo");
			model.addAttribute("usuarioLogin", usuarioLogin);
			return "IniciarSesion/iniciarsesion";

		} catch (Exception e) {
			model.addAttribute("error", "Error al iniciar sesion: " + e.getMessage());
			model.addAttribute("usuarioLogin", usuarioLogin != null ? usuarioLogin : new Usuario());
			return "IniciarSesion/iniciarsesion";
		}
	}

	@GetMapping("/test-email")
	@ResponseBody
	public ResponseEntity<?> testEmailDirecto() {
		try {
			LOGGER.info("INICIANDO PRUEBA DIRECTA DE CORREO");

			String resultado = emailService.enviarCorreoRecuperacion("helpyourpet79@gmail.com", "token-de-prueba-123",
					"Usuario Prueba");

			LOGGER.info("PRUEBA DE CORREO COMPLETADA: {}", resultado);

			return ResponseEntity
					.ok(java.util.Map.of("status", "success", "message", "Correo de prueba enviado exitosamente",
							"resultado", resultado != null ? resultado : "Correo enviado"));

		} catch (Exception e) {
			LOGGER.error("ERROR EN PRUEBA DE CORREO: {}", e.getMessage(), e);

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(java.util.Map.of("status", "error",
					"message", "Error al enviar correo de prueba", "error", e.getMessage(), "fullError", e.toString()));
		}
	}

	@GetMapping("/inicio")
	public String mostrarInicio(@RequestParam(defaultValue = "0") int page, Model model, HttpSession session) {

		Usuario usuarioLogueado = (Usuario) session.getAttribute("usuarioLogueado");
		if (usuarioLogueado == null) {
			return "IniciarSesion/iniciarsesion";
		}

		int pageSize = 6;
		org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page,
				pageSize);

		org.springframework.data.domain.Page<com.clinicpet.demo.model.Evento> eventosPage = eventoRepository
				.findAll(pageable);

		model.addAttribute("usuario", usuarioLogueado);
		model.addAttribute("mensaje", "Bienvenido al Dashboard ClinicPet");
		model.addAttribute("eventos", eventosPage.getContent());
		model.addAttribute("currentPage", page);
		model.addAttribute("totalPages", eventosPage.getTotalPages());
		model.addAttribute("totalItems", eventosPage.getTotalElements());

		return "Inicio/inicio";
	}

	@GetMapping("/registro")
	public String mostrarFormularioRegistro(Model model) {
		model.addAttribute("usuario", new Usuario());
		return "Registro/registro";
	}

	@PostMapping("/registro")
	public String procesarRegistro(@ModelAttribute Usuario usuario, Model model,
			RedirectAttributes redirectAttributes) {
		try {
			Usuario nuevoUsuario = usuarioService.crearUsuario(usuario);
			redirectAttributes.addFlashAttribute("mensaje", "Registro exitoso! Bienvenido a HelpYourPet");
			return "redirect:/";

		} catch (RuntimeException e) {
			model.addAttribute("error", e.getMessage());
			model.addAttribute("usuario", usuario);
			return "Registro/registro";
		}
	}

	@GetMapping("/perfilusuario")
	public String perfilusuario(Model model, HttpSession session) {
		Usuario usuarioLogueado = (Usuario) session.getAttribute("usuarioLogueado");
		if (usuarioLogueado == null) {
			return "redirect:/iniciarsesion";
		}

		model.addAttribute("idUsuarioActual", usuarioLogueado.getId());
		model.addAttribute("mascota", new Mascota());

		List<Mascota> mascotas = mascotaService.buscarPorUsuario(usuarioLogueado.getId());
		model.addAttribute("mascotas", mascotas);
		model.addAttribute("tieneMascotas", !mascotas.isEmpty());

		List<Adopcion> misAdopciones = adopcionService.buscarAdopcionesByUsuarioId(usuarioLogueado.getId());
		model.addAttribute("misAdopciones", misAdopciones);
		model.addAttribute("tieneAdopciones", !misAdopciones.isEmpty());

		model.addAttribute("usuarioLogueado", usuarioLogueado);

		return "Usuario/perfilusuario";
	}

	@GetMapping("/perfilusuario/mascota/{id}")
	@ResponseBody
	public ResponseEntity<Mascota> obtenerMascotaPorId(@PathVariable Integer id, HttpSession session) {
		LOGGER.info("Buscando mascota con ID: {}", id);

		Usuario usuarioLogueado = (Usuario) session.getAttribute("usuarioLogueado");
		if (usuarioLogueado == null) {
			LOGGER.warn("Usuario no logueado");
			return ResponseEntity.status(401).build();
		}

		Optional<Mascota> mascotaOpt = mascotaService.buscarMascotaPorId(id);
		if (mascotaOpt.isEmpty()) {
			LOGGER.warn("Mascota no encontrada con ID: {}", id);
			return ResponseEntity.notFound().build();
		}

		Mascota mascota = mascotaOpt.get();

		if (!mascota.getUsuario().getId().equals(usuarioLogueado.getId())) {
			LOGGER.warn("Usuario {} intento acceder a mascota {} que no le pertenece", usuarioLogueado.getId(), id);
			return ResponseEntity.status(403).build();
		}

		LOGGER.info("Mascota encontrada: {} - Unidad Edad: {}", mascota.getNombre(), mascota.getUnidadEdad());
		return ResponseEntity.ok(mascota);
	}

	@PostMapping("/perfilusuario/agregarMascota")
	public String agregarMascota(@ModelAttribute Mascota mascota, @RequestParam("idUsuario") Integer idUsuario,
			@RequestParam(value = "fotoFile", required = false) MultipartFile fotoFile,
			RedirectAttributes redirectAttributes) {

		try {
			if (idUsuario == null) {
				redirectAttributes.addFlashAttribute("error", "ID de usuario invalido");
				return "redirect:/usuarios/perfilusuario";
			}

			Optional<Usuario> optionalUsuario = usuarioService.buscarUsuarioPorId(idUsuario);
			if (optionalUsuario.isEmpty()) {
				redirectAttributes.addFlashAttribute("error", "Usuario no encontrado");
				return "redirect:/usuarios/perfilusuario";
			}

			Usuario usuarioExistente = optionalUsuario.get();
			mascota.setUsuario(usuarioExistente);

			if (fotoFile != null && !fotoFile.isEmpty()) {
				String uploadDir = System.getProperty("user.dir") + "/uploads/";
				String fileName = System.currentTimeMillis() + "_" + fotoFile.getOriginalFilename();

				Path uploadPath = Paths.get(uploadDir);
				if (!Files.exists(uploadPath)) {
					Files.createDirectories(uploadPath);
				}

				Path filePath = uploadPath.resolve(fileName);
				Files.copy(fotoFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

				mascota.setFoto("/uploads/" + fileName);
			} else {
				mascota.setFoto("/uploads/default_pet.png");
			}

			mascotaService.guardarMascota(mascota);
			redirectAttributes.addFlashAttribute("success",
					"Mascota '" + mascota.getNombre() + "' agregada correctamente");

		} catch (IOException e) {
			redirectAttributes.addFlashAttribute("error", "Error al subir la foto: " + e.getMessage());
			e.printStackTrace();
		} catch (Exception e) {
			redirectAttributes.addFlashAttribute("error", "Error al agregar mascota: " + e.getMessage());
			e.printStackTrace();
		}

		return "redirect:/usuarios/perfilusuario";
	}

	@PostMapping("/perfilusuario/actualizarMascota")
	public String actualizarMascota(@ModelAttribute Mascota mascota,
			@RequestParam(value = "fotoFile", required = false) MultipartFile fotoFile,
			RedirectAttributes redirectAttributes, HttpSession session) {

		try {
			if (mascota.getId() == null) {
				redirectAttributes.addFlashAttribute("error", "ID de mascota requerido para actualizacion.");
				return "redirect:/usuarios/perfilusuario";
			}

			Usuario usuarioLogueado = (Usuario) session.getAttribute("usuarioLogueado");
			if (usuarioLogueado == null) {
				return "redirect:/usuarios/login";
			}

			Optional<Mascota> mascotaExistenteOpt = mascotaService.buscarMascotaPorId(mascota.getId());
			if (mascotaExistenteOpt.isEmpty()) {
				redirectAttributes.addFlashAttribute("error", "Mascota no encontrada.");
				return "redirect:/usuarios/perfilusuario";
			}

			Mascota mascotaExistente = mascotaExistenteOpt.get();

			if (!mascotaExistente.getUsuario().getId().equals(usuarioLogueado.getId())) {
				redirectAttributes.addFlashAttribute("error", "No tienes permiso para editar esta mascota.");
				return "redirect:/usuarios/perfilusuario";
			}

			if (fotoFile != null && !fotoFile.isEmpty()) {
				String uploadDir = System.getProperty("user.dir") + "/uploads/";
				String fileName = System.currentTimeMillis() + "_" + fotoFile.getOriginalFilename();

				Path uploadPath = Paths.get(uploadDir);
				if (!Files.exists(uploadPath)) {
					Files.createDirectories(uploadPath);
				}

				Path filePath = uploadPath.resolve(fileName);
				Files.copy(fotoFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

				mascota.setFoto("/uploads/" + fileName);
			} else {
				mascota.setFoto(mascotaExistente.getFoto());
			}

			mascota.setUsuario(usuarioLogueado);
			mascotaService.actualizarMascota(mascota);

			redirectAttributes.addFlashAttribute("success",
					"Mascota '" + mascota.getNombre() + "' actualizada correctamente");

		} catch (IOException e) {
			redirectAttributes.addFlashAttribute("error", "Error al subir la foto: " + e.getMessage());
			e.printStackTrace();
		} catch (Exception e) {
			redirectAttributes.addFlashAttribute("error", "Error al actualizar mascota: " + e.getMessage());
			e.printStackTrace();
		}

		return "redirect:/usuarios/perfilusuario";
	}

	@DeleteMapping("/perfilusuario/eliminarmascota/{id}")
	public ResponseEntity<String> eliminarMascota(@PathVariable Integer id, HttpSession session) {
		try {
			Usuario usuarioLogueado = (Usuario) session.getAttribute("usuarioLogueado");
			if (usuarioLogueado == null) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No autorizado");
			}
			mascotaService.eliminarMascota(id);
			return ResponseEntity.ok("Mascota eliminada exitosamente");
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: " + e.getMessage());
		}
	}

	@PostMapping("/perfilusuario/actualizarFotoPerfil")
	@ResponseBody
	public ResponseEntity<?> actualizarFotoPerfil(@RequestBody Map<String, String> request) {
		try {
			String fotoBase64 = request.get("fotoPerfil");
			Long usuarioId = Long.parseLong(request.get("usuarioId"));

			if (fotoBase64 != null && !fotoBase64.isEmpty()) {
				String rutaFoto = guardarImagenDesdeBase64(fotoBase64, usuarioId);
				usuarioService.actualizarFotoPerfil(usuarioId, rutaFoto);
				return ResponseEntity.ok().body(Map.of("mensaje", "Foto actualizada correctamente"));
			}

			return ResponseEntity.badRequest().body(Map.of("error", "Datos de imagen invalidos"));

		} catch (Exception e) {
			return ResponseEntity.internalServerError()
					.body(Map.of("error", "Error al actualizar la foto: " + e.getMessage()));
		}
	}

	@PostMapping("/perfilusuario/eliminarFotoPerfil")
	@ResponseBody
	public ResponseEntity<?> eliminarFotoPerfil(@RequestBody Map<String, String> request) {
		try {
			Long usuarioId = Long.parseLong(request.get("usuarioId"));
			usuarioService.eliminarFotoPerfil(usuarioId);
			return ResponseEntity.ok().body(Map.of("mensaje", "Foto eliminada correctamente"));

		} catch (Exception e) {
			return ResponseEntity.internalServerError()
					.body(Map.of("error", "Error al eliminar la foto: " + e.getMessage()));
		}
	}

	private String guardarImagenDesdeBase64(String base64Image, Long usuarioId) {
		try {
			String[] parts = base64Image.split(",");
			String imageString = parts[1];

			byte[] imageBytes = Base64.getDecoder().decode(imageString);

			System.out.println("Procesando imagen de " + (imageBytes.length / (1024 * 1024)) + "MB");

			String uploadDir = "uploads/profiles/";
			Path uploadPath = Paths.get(uploadDir);
			if (!Files.exists(uploadPath)) {
				Files.createDirectories(uploadPath);
			}

			String fileName = "profile_" + usuarioId + "_" + System.currentTimeMillis() + ".webp";
			Path filePath = uploadPath.resolve(fileName);

			Files.write(filePath, imageBytes);

			return "/" + uploadDir + fileName;

		} catch (Exception e) {
			throw new RuntimeException("Error al guardar la imagen: " + e.getMessage(), e);
		}
	}

	@PostMapping("/usuario/{id}/foto")
	public ResponseEntity<?> actualizarFoto(@PathVariable Long id, @RequestParam("file") MultipartFile file) {

		try {
			String ruta = usuarioService.guardarFoto(id, file);
			return ResponseEntity.ok(ruta);
		} catch (Exception e) {
			return ResponseEntity.status(500).body("Error al subir la imagen");
		}
	}

	@DeleteMapping("/usuario/{id}/foto")
	public ResponseEntity<?> eliminarFoto(@PathVariable Long id) {
		usuarioService.eliminarFotoPerfil(id);
		return ResponseEntity.ok("Foto eliminada");
	}

	@PostMapping("/perfilusuario/actualizarInfoPersonal")
	public String actualizarInfoPersonal(@ModelAttribute("usuarioLogueado") Usuario usuarioForm, HttpSession session,
			RedirectAttributes redirectAttributes) {

		Usuario usuarioSession = (Usuario) session.getAttribute("usuarioLogueado");
		if (usuarioSession == null) {
			return "redirect:/usuarios/iniciarsesion";
		}

		try {
			Usuario actualizado = usuarioService.actualizarUsuario(usuarioForm.getId(), usuarioForm);

			if (actualizado != null) {
				session.setAttribute("usuarioLogueado", actualizado);
				redirectAttributes.addFlashAttribute("success", "Informacion de perfil actualizada correctamente");
			} else {
				redirectAttributes.addFlashAttribute("error", "No se encontro el usuario para actualizar");
			}
		} catch (Exception e) {
			redirectAttributes.addFlashAttribute("error", "Error al actualizar la informacion: " + e.getMessage());
		}

		return "redirect:/usuarios/perfilusuario";
	}

	@PutMapping("/usuario/actualizar/{id}")
	public ResponseEntity<Usuario> actualizarUsuario(@PathVariable Integer id,
			@RequestBody Usuario usuarioActualizado) {

		Usuario u = usuarioService.actualizarUsuario(id, usuarioActualizado);
		return ResponseEntity.ok(u);
	}

	@PutMapping("/usuario/{id}/password")
	public ResponseEntity<?> actualizarPassword(@PathVariable Integer id, @RequestBody String nuevaPassword) {

		usuarioService.actualizarPassword(id, nuevaPassword);
		return ResponseEntity.ok("Contrasena actualizada");
	}

	@GetMapping("/recovery")
	public String recovery() {
		return "RecuperarContrasena/recovery";
	}

	@DeleteMapping("/perfilusuario/eliminarCuenta")
	@ResponseBody
	public ResponseEntity<?> eliminarCuenta(HttpSession session) {
		try {
			Usuario usuarioLogueado = (Usuario) session.getAttribute("usuarioLogueado");
			if (usuarioLogueado == null) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "No hay usuario logueado"));
			}

			usuarioService.eliminarUsuario(usuarioLogueado.getId());
			session.invalidate();

			return ResponseEntity.ok().body(Map.of("mensaje", "Cuenta eliminada exitosamente"));

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("error", "Error al eliminar la cuenta: " + e.getMessage()));
		}
	}

	@GetMapping("/index")
	public String index(@RequestParam(defaultValue = "0") int page, Model model) {

		int pageSize = 6;
		org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page,
				pageSize);

		org.springframework.data.domain.Page<com.clinicpet.demo.model.Evento> eventosPage = eventoRepository
				.findAll(pageable);

		model.addAttribute("eventos", eventosPage.getContent());
		model.addAttribute("currentPage", page);
		model.addAttribute("totalPages", eventosPage.getTotalPages());
		model.addAttribute("totalItems", eventosPage.getTotalElements());

		return "index";
	}

	@GetMapping("/sobrenosotros")
	public String sobreNosotros() {
		return "SobreNosotros/sobrenosotros";
	}

	@GetMapping("/tienda")
	public String tienda() {
		return "Tienda/tienda";
	}

	@GetMapping("/pasarela-pagos")
	public String pasarelaPagos() {
		return "Tienda/pasarela-pagos";
	}

	@GetMapping("/api/veterinarias")
	@ResponseBody
	public ResponseEntity<List<VeterinariaDTO>> obtenerVeterinarias() {
		try {
			List<Veterinaria> veterinarias = veterinariaRepository.findAll();

			List<VeterinariaDTO> veterinariasDTO = veterinarias.stream()
					.map(v -> new VeterinariaDTO(v.getId(), v.getNombre(), v.getDireccion(), v.getTelefono(),
							v.getCorreo(), v.getHorario(), v.getDescripcion(), v.getEstado()))
					.collect(Collectors.toList());

			LOGGER.info("Se encontraron {} veterinarias", veterinariasDTO.size());
			return ResponseEntity.ok(veterinariasDTO);
		} catch (Exception e) {
			LOGGER.error("Error al obtener veterinarias: {}", e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@GetMapping("/api/veterinarias/{veterinariaId}/productos")
	@ResponseBody
	public ResponseEntity<List<ProductoDTO>> obtenerProductosPorVeterinaria(@PathVariable Integer veterinariaId) {
		try {
			LOGGER.info("Buscando productos para veterinaria ID: {}", veterinariaId);

			Optional<Veterinaria> veterinariaOpt = veterinariaRepository.findById(veterinariaId);
			if (veterinariaOpt.isEmpty()) {
				LOGGER.warn("Veterinaria no encontrada con ID: {}", veterinariaId);
				return ResponseEntity.notFound().build();
			}

			Veterinaria veterinaria = veterinariaOpt.get();
			List<Inventario> inventarios = inventarioRepository.findByVeterinaria(veterinaria);

			List<ProductoDTO> productosDTO = inventarios.stream()
					.filter(inv -> inv.getCantidadDisponible() != null && inv.getCantidadDisponible() > 0)
					.map(inv -> new ProductoDTO(inv.getProducto().getId(), inv.getProducto().getNombre(),
							inv.getProducto().getDescripcion(), inv.getProducto().getPrecio(),
							inv.getProducto().getImagen(), inv.getProducto().getCategoria(),
							inv.getCantidadDisponible(), inv.getEstado()))
					.collect(Collectors.toList());

			LOGGER.info("Se encontraron {} productos disponibles para veterinaria '{}'", productosDTO.size(),
					veterinaria.getNombre());

			return ResponseEntity.ok(productosDTO);

		} catch (Exception e) {
			LOGGER.error("Error al obtener productos de veterinaria {}: {}", veterinariaId, e.getMessage());
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@PostMapping("/api/ventas/registrar")
	@ResponseBody
	@Transactional
	public ResponseEntity<?> registrarVenta(@RequestBody Map<String, Object> ventaData, HttpSession session) {
		try {
			Usuario usuarioLogueado = (Usuario) session.getAttribute("usuarioLogueado");
			if (usuarioLogueado == null) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Usuario no autenticado"));
			}

			LOGGER.info("Registrando venta para usuario ID: {}", usuarioLogueado.getId());

			@SuppressWarnings("unchecked")
			List<Map<String, Object>> items = (List<Map<String, Object>>) ventaData.get("items");

			if (items == null || items.isEmpty()) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "El carrito esta vacio"));
			}

			// Obtener veterinariaId desde el primer producto del carrito
			Integer primerProductoId = convertToInteger(items.get(0).get("id"));
			List<Inventario> inventariosDelProducto = inventarioRepository.findByProducto_Id(primerProductoId);

			Integer veterinariaId = null;
			if (!inventariosDelProducto.isEmpty()) {
				veterinariaId = inventariosDelProducto.get(0).getVeterinaria().getId();
				LOGGER.info("Veterinaria encontrada desde inventario del producto: {}", veterinariaId);
			}

			if (veterinariaId == null) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST)
						.body(Map.of("error", "No se encontro veterinaria asociada a los productos"));
			}

			Double subtotal = convertToDouble(ventaData.get("subtotal"));
			Double total = convertToDouble(ventaData.get("total"));

			Venta venta = new Venta();
			venta.setUsuario(usuarioLogueado);
			venta.setFecha(new Date());
			venta.setSubtotal(subtotal);
			venta.setTotal(total);

			Venta ventaGuardada = ventaRepository.save(venta);

			Pago pago = new Pago();
			pago.setVenta(ventaGuardada);
			pago.setMetodo((String) ventaData.get("metodoPago"));
			pago.setEstado("completado");
			pago.setReferencia((String) ventaData.get("numeroOrden"));
			pago.setFechaPago(LocalDateTime.now());
			ventaGuardada.setPago(pago);

			List<DetalleVenta> detalles = new ArrayList<>();

			// Procesar cada item y deducir del inventario
			for (Map<String, Object> item : items) {
				Integer productoId = convertToInteger(item.get("id"));
				Integer cantidad = convertToInteger(item.get("quantity"));
				Double precio = convertToDouble(item.get("precio"));

				Optional<Producto> productoOpt = productoRepository.findById(productoId);
				if (productoOpt.isPresent()) {
					// Validar y deducir stock del inventario
					Inventario inventario = inventarioService.obtenerInventarioPorVeterinariaYProducto(veterinariaId,
							productoId);
					if (inventario == null) {
						throw new RuntimeException("No existe inventario para el producto ID: " + productoId
								+ " en la veterinaria ID: " + veterinariaId);
					}

					LOGGER.info("Validando stock - Producto: {}, Stock actual: {}, Solicitado: {}", productoId,
							inventario.getCantidadDisponible(), cantidad);

					if (inventario.getCantidadDisponible() < cantidad) {
						throw new RuntimeException("Stock insuficiente para el producto "
								+ productoOpt.get().getNombre() + ". Stock disponible: "
								+ inventario.getCantidadDisponible() + ", solicitado: " + cantidad);
					}

					// Deducir stock
					Inventario inventarioActualizado = inventarioService.reducirStock(inventario.getId(), cantidad);
					LOGGER.info("Stock actualizado - Producto: {}, Nuevo stock: {}", productoId,
							inventarioActualizado.getCantidadDisponible());

					// Crear detalle de venta
					DetalleVenta detalle = new DetalleVenta();
					detalle.setVenta(ventaGuardada);
					detalle.setProducto(productoOpt.get());
					detalle.setCantidad(cantidad);
					detalle.setPrecioUnitario(precio);
					detalles.add(detalle);
				}
			}

			ventaGuardada.setDetallesVenta(detalles);
			ventaRepository.save(ventaGuardada);

			LOGGER.info("Venta registrada exitosamente. ID: {}", ventaGuardada.getId());

			return ResponseEntity
					.ok(Map.of("mensaje", "Venta registrada exitosamente", "ventaId", ventaGuardada.getId()));

		} catch (Exception e) {
			LOGGER.error("Error al registrar venta: {}", e.getMessage());
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("error", "Error al registrar la venta: " + e.getMessage()));
		}
	}

	@GetMapping("/api/ventas/mis-compras")
	@ResponseBody
	@Transactional(readOnly = true)
	public ResponseEntity<List<VentaDTO>> obtenerMisCompras(HttpSession session) {
		try {
			Usuario usuarioLogueado = (Usuario) session.getAttribute("usuarioLogueado");
			if (usuarioLogueado == null) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
			}

			LOGGER.info("Obteniendo compras del usuario ID: {}", usuarioLogueado.getId());

			List<Venta> ventas = ventaRepository.findByUsuarioId(usuarioLogueado.getId());

			List<VentaDTO> ventasDTO = ventas.stream().map(venta -> {
				VentaDTO dto = new VentaDTO();
				dto.setId(venta.getId());
				dto.setFecha(venta.getFecha());
				dto.setSubtotal(venta.getSubtotal());
				dto.setTotal(venta.getTotal());

				if (venta.getPago() != null) {
					dto.setMetodoPago(venta.getPago().getMetodo());
					dto.setEstadoPago(venta.getPago().getEstado());
					dto.setReferencia(venta.getPago().getReferencia());
				}

				if (venta.getDetallesVenta() != null) {
					List<VentaDTO.DetalleVentaDTO> detallesDTO = venta.getDetallesVenta().stream()
							.map(detalle -> new VentaDTO.DetalleVentaDTO(detalle.getProducto().getId(),
									detalle.getProducto().getNombre(), detalle.getCantidad(),
									detalle.getPrecioUnitario(), detalle.getCantidad() * detalle.getPrecioUnitario()))
							.collect(Collectors.toList());
					dto.setDetalles(detallesDTO);
				}

				return dto;
			}).collect(Collectors.toList());

			LOGGER.info("Se encontraron {} compras", ventasDTO.size());
			return ResponseEntity.ok(ventasDTO);

		} catch (Exception e) {
			LOGGER.error("Error al obtener compras: {}", e.getMessage());
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	private Double convertToDouble(Object value) {
		if (value == null)
			return 0.0;
		if (value instanceof Double)
			return (Double) value;
		if (value instanceof Integer)
			return ((Integer) value).doubleValue();
		if (value instanceof String)
			return Double.parseDouble((String) value);
		return Double.parseDouble(value.toString());
	}

	private Integer convertToInteger(Object value) {
		if (value == null)
			return 0;
		if (value instanceof Integer)
			return (Integer) value;
		if (value instanceof Double)
			return ((Double) value).intValue();
		if (value instanceof String)
			return Integer.parseInt((String) value);
		return Integer.parseInt(value.toString());
	}

	@PostMapping("/api/password-reset/request")
	@ResponseBody
	public ResponseEntity<?> solicitarRecuperacion(@RequestBody Map<String, String> request) {
		try {
			String email = request.get("email");
			if (email == null || email.trim().isEmpty()) {
				return ResponseEntity.badRequest().body(Map.of("error", "El correo electronico es requerido"));
			}

			LOGGER.info("Solicitud de recuperacion para correo: {}", email);

			passwordResetService.solicitarRecuperacion(email.trim());

			return ResponseEntity.ok(Map.of("mensaje",
					"Si el correo esta registrado, recibiras un enlace de recuperacion", "success", true));

		} catch (MessagingException e) {
			LOGGER.error("Error al enviar correo de recuperacion: {}", e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("error", "Error al enviar el correo de recuperacion. Por favor intenta mas tarde."));
		} catch (Exception e) {
			LOGGER.error("Error en solicitud de recuperacion: {}", e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("error", "Error al procesar la solicitud. Por favor intenta mas tarde."));
		}
	}

	@PostMapping("/api/password-reset/confirm")
	@ResponseBody
	public ResponseEntity<?> restablecerContrasena(@RequestBody Map<String, String> request) {
		try {
			String token = request.get("token");
			String nuevaContrasena = request.get("nuevaContrasena");

			if (token == null || token.trim().isEmpty()) {
				return ResponseEntity.badRequest().body(Map.of("error", "El token de recuperacion es requerido"));
			}

			if (nuevaContrasena == null || nuevaContrasena.length() < 6) {
				return ResponseEntity.badRequest()
						.body(Map.of("error", "La contrasena debe tener al menos 6 caracteres"));
			}

			LOGGER.info("Intento de restablecer contrasena con token: {}", token.substring(0, 8) + "...");

			String resultado = passwordResetService.restablecerContrasena(token.trim(), nuevaContrasena);

			if (resultado.contains("expirado") || resultado.contains("invalido")) {
				return ResponseEntity.badRequest().body(Map.of("error", resultado));
			}

			return ResponseEntity.ok(Map.of("mensaje", resultado, "success", true));

		} catch (Exception e) {
			LOGGER.error("Error al restablecer contrasena: {}", e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("error", "Error al restablecer la contrasena. Por favor solicita un nuevo enlace."));
		}
	}

	@GetMapping("/recovery-contra")
	public String mostrarRestablecerContrasena(@RequestParam(required = false) String token, Model model) {
		if (token == null || token.trim().isEmpty()) {
			model.addAttribute("error", "Token de recuperacion no proporcionado");
			return "RestablecerContrasena/recovery-contra";
		}

		String validacion = passwordResetService.validarToken(token);
		if (validacion.contains("invalido") || validacion.contains("expirado")) {
			model.addAttribute("error", validacion);
			model.addAttribute("tokenInvalido", true);
		} else {
			model.addAttribute("token", token);
			model.addAttribute("tokenValido", true);
		}

		return "RestablecerContrasena/recovery-contra";
	}

}
