package com.clinicpet.demo.service;

import com.clinicpet.demo.model.Usuario;

import com.clinicpet.demo.repository.IReporteDeMaltratoRepository;
import com.clinicpet.demo.model.Rol;
import com.clinicpet.demo.repository.IUsuarioRepository;
import com.clinicpet.demo.repository.IRolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UsuarioServiceImplement implements IUsuarioService {

	@Autowired
	private final IReporteDeMaltratoRepository reporteDeMaltratoRepository;

	@Autowired
	private IUsuarioRepository usuarioRepository;

	@Autowired
	private IRolRepository rolRepository;

	UsuarioServiceImplement(IReporteDeMaltratoRepository IReporteDeMaltratoRepository) {
		this.reporteDeMaltratoRepository = IReporteDeMaltratoRepository;
	}

	@Override
	@Transactional
	public Usuario crearUsuario(Usuario usuario) {
		// *** CORRECCIÓN BÁSICA: Validación null y logs para depurar ***
		System.out.println("Service: Iniciando creación de usuario con correo: "
				+ (usuario.getCorreo() != null ? usuario.getCorreo() : "NULL"));

		if (usuario.getCorreo() == null || usuario.getCorreo().trim().isEmpty()) {
			throw new RuntimeException("Correo es requerido y no puede estar vacío");
		}
		if (usuario.getNombres() == null || usuario.getNombres().trim().isEmpty()) {
			throw new RuntimeException("Nombres son requeridos");
		}
		if (usuario.getPassword() == null || usuario.getPassword().trim().isEmpty()) {
			throw new RuntimeException("Contraseña es requerida");
		}

		// Validación básica de correo (duplicado)
		if (usuarioRepository.existsByCorreo(usuario.getCorreo().trim())) {
			throw new RuntimeException("Correo ya existe");
		}

		// Asignación de rol simplificada (opcional para local)
		if (usuario.getRol() == null) {
			Optional<Rol> rolDefaultOpt = rolRepository.findById(1); // ID 1 = USUARIO
			if (rolDefaultOpt.isPresent()) {
				usuario.setRol(rolDefaultOpt.get());
				System.out.println("Service: Rol asignado correctamente (ID: 1)");
			} else {
				System.out.println("Service: Rol por defecto no encontrado, guardando sin rol");
				usuario.setRol(null); // Explícito para evitar null pointer
			}
		} else {
			Integer rolId = usuario.getRol().getId();
			if (rolId != null && rolRepository.existsById(rolId)) {
				usuario.setRol(rolRepository.findById(rolId).get());
				System.out.println("Service: Rol proporcionado asignado (ID: " + rolId + ")");
			} else {
				System.out.println("Service: Rol proporcionado no existe, guardando sin rol");
				usuario.setRol(null);
			}
		}

		// Log antes del save
		System.out.println("Service: Guardando usuario: " + usuario.getNombres() + " - " + usuario.getCorreo());

		// Guarda el usuario (debe generar INSERT aquí)
		Usuario guardado = usuarioRepository.save(usuario);

		// Log después del save (confirma commit y ID generado)
		System.out.println("Service: Usuario guardado exitosamente con ID: " + guardado.getId());

		return guardado;
	}

	@Override
	@Transactional
	public Usuario actualizarUsuario(Integer id, Usuario usuarioActualizado) {
		// *** CORRECCIÓN BÁSICA: Validación null y correo único ***
		System.out.println("Service: Actualizando usuario ID: " + id);

		if (usuarioActualizado.getCorreo() == null || usuarioActualizado.getCorreo().trim().isEmpty()) {
			throw new RuntimeException("Correo es requerido para actualización");
		}

		Optional<Usuario> usuarioExistente = usuarioRepository.findById(id);
		if (usuarioExistente.isPresent()) {
			Usuario usuario = usuarioExistente.get();

			// Verifica correo único (excepto si es el mismo usuario)
			if (!usuario.getCorreo().equals(usuarioActualizado.getCorreo())
					&& usuarioRepository.existsByCorreo(usuarioActualizado.getCorreo())) {
				throw new RuntimeException("Correo ya existe en otro usuario");
			}

			usuario.setImagen(
					usuarioActualizado.getImagen() != null ? usuarioActualizado.getImagen() : usuario.getImagen());

			usuario.setCorreo(usuarioActualizado.getCorreo().trim());
			usuario.setNombres(usuarioActualizado.getNombres() != null ? usuarioActualizado.getNombres().trim()
					: usuario.getNombres());
			usuario.setApellidos(usuarioActualizado.getApellidos() != null ? usuarioActualizado.getApellidos().trim()
					: usuario.getApellidos());
			usuario.setTelefono(usuarioActualizado.getTelefono() != null ? usuarioActualizado.getTelefono().trim()
					: usuario.getTelefono());

			usuario.setDireccion(usuarioActualizado.getDireccion() != null ? usuarioActualizado.getDireccion().trim()
					: usuario.getDireccion());
			usuario.setPassword(usuarioActualizado.getPassword() != null ? usuarioActualizado.getPassword()
					: usuario.getPassword());
			
			// ✅ AGREGAR: Actualizar edad y número de documento
			usuario.setEdad(usuarioActualizado.getEdad() != null ? usuarioActualizado.getEdad() : usuario.getEdad());
			usuario.setNumDocumento(usuarioActualizado.getNumDocumento() != null ? usuarioActualizado.getNumDocumento().trim() : usuario.getNumDocumento());
			
			// ⚠️ IMPORTANTE: NO actualizar tipoDocumento - mantener el original
			// usuario.setTipoDocumento() - INTENCIONALMENTE OMITIDO para preservar el tipo original

			// Asigna rol si se proporciona
			if (usuarioActualizado.getRol() != null) {
				Integer rolId = usuarioActualizado.getRol().getId();
				if (rolId != null && rolRepository.existsById(rolId)) {
					usuario.setRol(rolRepository.findById(rolId).get());
				} else {
					usuario.setRol(null); // Opcional
				}
			}

			Usuario actualizado = usuarioRepository.save(usuario);
			System.out.println("Service: Usuario actualizado exitosamente con ID: " + actualizado.getId());
			return actualizado;
		}
		System.out.println("Service: Usuario no encontrado para ID: " + id);
		return null;
	}

	@Override
	public List<Usuario> listarTodosUsuarios() {
		System.out.println("Service: Listando todos los usuarios");
		return usuarioRepository.findAll();
	}

	@Override
	public Optional<Usuario> buscarUsuarioPorId(Integer id) {
		System.out.println("Service: Buscando usuario por ID: " + id);
		return usuarioRepository.findById(id);
	}

	@Override
	public Optional<Usuario> buscarUsuarioPorNombres(String nombres) {
		if (nombres == null || nombres.trim().isEmpty()) {
			return Optional.empty(); // *** CORRECCIÓN: Evita query vacía ***
		}
		System.out.println("Service: Buscando usuario por nombres (parcial): " + nombres);
		return usuarioRepository.findByNombresContaining(nombres.trim()); // Usa método del repo (parcial)
	}

	@Override
	public Optional<Usuario> buscarUsuarioPorCorreo(String correo) {
		if (correo == null || correo.trim().isEmpty()) {
			return Optional.empty();
		}
		System.out.println("Service: Buscando usuario por correo: " + correo);
		return usuarioRepository.findByCorreo(correo.trim());
	}

	@Override
	public Optional<Usuario> buscarUsuarioPorDocumento(String numDocumento) {
		if (numDocumento == null || numDocumento.trim().isEmpty()) {
			return Optional.empty();
		}
		System.out.println("Service: Buscando usuario por documento: " + numDocumento);
		return usuarioRepository.findByNumDocumento(numDocumento.trim()); // Usa método del repo
	}

	@Override
	public List<Usuario> buscarUsuariosPorRol(Integer rolId) {
		if (rolId == null) {
			return List.of(); // *** CORRECCIÓN: Evita null ***
		}
		System.out.println("Service: Buscando usuarios por rol ID: " + rolId);
		// *** CORRECCIÓN: Tu repo no tiene findByRolId; usa findAll() filtrado (simple,
		// sin query personalizada)
		// Sugerencia: Agrega al repo: List<Usuario> findByRolId(Integer rolId);
		return usuarioRepository.findAll().stream().filter(u -> u.getRol() != null && u.getRol().getId().equals(rolId))
				.collect(Collectors.toList());
	}

	@Override
	public List<Usuario> buscarUsuariosPorNombresOApellidos(String nombres, String apellidos) {
		if ((nombres == null || nombres.trim().isEmpty()) && (apellidos == null || apellidos.trim().isEmpty())) {
			return List.of(); // *** CORRECCIÓN: Evita retornar todos si params vacíos ***
		}
		// *** CORRECCIÓN BÁSICA: Usa el método OR del repo (parcial en nombres O
		// apellidos) ***
		System.out.println("Service: Buscando usuarios por nombres o apellidos: " + nombres + " / " + apellidos);
		return usuarioRepository.findByNombresContainingOrApellidosContaining(nombres != null ? nombres.trim() : "",
				apellidos != null ? apellidos.trim() : "");
	}

	@Override
	public boolean existeCorreo(String correo) {
		if (correo == null || correo.trim().isEmpty()) {
			return false;
		}
		return usuarioRepository.existsByCorreo(correo.trim());
	}

	@Override
	public boolean existeDocumento(String numDocumento) {
		if (numDocumento == null || numDocumento.trim().isEmpty()) {
			return false;
		}
		return usuarioRepository.existsByNumDocumento(numDocumento.trim()); // Usa método del repo
	}

	@Override
	public boolean existeNombres(String nombres) {
		if (nombres == null || nombres.trim().isEmpty()) {
			return false;
		}
		return usuarioRepository.existsByNombres(nombres.trim()); // Usa método del repo (exacta)
	}

	@Override
	@Transactional
	public Usuario activarUsuario(Integer id) {
		System.out.println("Service: Activando usuario ID: " + id);
		Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
		if (usuarioOpt.isPresent()) {
			Usuario usuario = usuarioOpt.get();
			usuario.setActivo(true);
			Usuario activado = usuarioRepository.save(usuario);
			System.out.println("Service: Usuario activado con ID: " + activado.getId());
			return activado;
		}
		return null;
	}

	@Override
	@Transactional
	public Usuario desactivarUsuario(Integer id) {
		System.out.println("Service: Desactivando usuario ID: " + id);
		Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
		if (usuarioOpt.isPresent()) {
			Usuario usuario = usuarioOpt.get();
			usuario.setActivo(false);
			Usuario desactivado = usuarioRepository.save(usuario);
			System.out.println("Service: Usuario desactivado con ID: " + desactivado.getId());
			return desactivado;
		}
		return null;
	}

	@Override
	@Transactional
	public Usuario asignarRol(Integer id, Integer rolId) {
		System.out.println("Service: Asignando rol ID " + rolId + " a usuario ID: " + id);
		Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
		if (usuarioOpt.isPresent() && rolRepository.existsById(rolId)) {
			Usuario usuario = usuarioOpt.get();
			usuario.setRol(rolRepository.findById(rolId).get());
			Usuario conRol = usuarioRepository.save(usuario);
			System.out.println("Service: Rol asignado exitosamente");
			return conRol;
		}
		return null;
	}

	@Override
	@Transactional
	public void eliminarUsuario(Integer id) {
		System.out.println("Service: Eliminando usuario ID: " + id);
		if (usuarioRepository.existsById(id)) {
			usuarioRepository.deleteById(id);
			System.out.println("Service: Usuario eliminado exitosamente");
		} else {
			System.out.println("Service: Usuario no encontrado para eliminar");
		}
	}

	@Override
	public boolean validarCredencialesPorCorreo(String correo, String password) {
		if (correo == null || password == null) {
			return false;
		}
		System.out.println("Service: Validando credenciales para correo: " + correo);
		Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreo(correo.trim());
		if (usuarioOpt.isPresent()) {
			Usuario usuario = usuarioOpt.get();
			boolean valido = password.equals(usuario.getPassword()) && usuario.isActivo(); // *** CORRECCIÓN: Verifica
																							// activo ***
			System.out.println("Service: Credenciales válidas: " + valido);
			return valido;
		}
		return false;
	}

	@Override
	@Transactional
	public void save(Usuario usuario) {
		System.out.println("Service: Llamando save (reutiliza crearUsuario)");
		crearUsuario(usuario); // Reutiliza la lógica
	}

	@Override

	@Transactional
	public void actualizarPassword(Integer usuarioId, String nuevaPassword) {
		try {
			Optional<Usuario> usuarioOpt = usuarioRepository.findById(usuarioId);
			if (usuarioOpt.isPresent()) {
				Usuario usuario = usuarioOpt.get();
				usuario.setPassword(nuevaPassword);
				usuarioRepository.save(usuario);
				System.out.println("✅ Contraseña actualizada en BD para ID: " + usuarioId);
			} else {
				throw new RuntimeException("Usuario no encontrado con ID: " + usuarioId);
			}
		} catch (Exception e) {
			System.out.println("❌ Error en actualizarPassword: " + e.getMessage());
			throw e;
		}
	}

	@Override
	public void actualizarFotoPerfil(Long usuarioId, String rutaFoto) {
		Usuario usuario = usuarioRepository.findById(usuarioId.intValue()).orElse(null);
		if (usuario == null) {
			return;
		}

		try {
			if (usuario.getImagen() != null && !usuario.getImagen().isEmpty()
					&& !usuario.getImagen().equals(rutaFoto)) {
				File fotoAnterior = new File(usuario.getImagen());
				if (fotoAnterior.exists()) {
					fotoAnterior.delete();
				}
			}

			usuario.setImagen(rutaFoto);
			usuarioRepository.save(usuario);

		} catch (Exception e) {
			throw new RuntimeException("Error actualizando la foto de perfil: " + e.getMessage());
		}
	}

	@Override
	public String guardarFoto(Long usuarioId, MultipartFile foto) {

		try {
			String carpeta = "uploads/usuarios/";
			File directory = new File(carpeta);
			if (!directory.exists()) {
				directory.mkdirs();
			}

			String nombreArchivo = usuarioId + "_" + foto.getOriginalFilename();
			String ruta = carpeta + nombreArchivo;

			File archivoDestino = new File(ruta);
			foto.transferTo(archivoDestino);

			Usuario usuario = usuarioRepository.findById(usuarioId.intValue()).get();
			usuario.setImagen(ruta);
			usuarioRepository.save(usuario);

			return ruta;

		} catch (Exception e) {
			throw new RuntimeException("Error guardando la foto: " + e.getMessage());
		}
	}

	@Override
	public void eliminarFotoPerfil(Long usuarioId) {

		Usuario usuario = usuarioRepository.findById(usuarioId.intValue()).orElse(null);
		if (usuario == null)
			return;

		try {
			if (usuario.getImagen() != null) {
				File fotoFile = new File(usuario.getImagen());
				if (fotoFile.exists()) {
					fotoFile.delete();
				}
			}

			usuario.setImagen(null);
			usuarioRepository.save(usuario);

		} catch (Exception e) {
			throw new RuntimeException("Error eliminando la foto: " + e.getMessage());
		}
	}

}