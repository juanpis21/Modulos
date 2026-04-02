package com.clinicpet.demo.service;

import com.clinicpet.demo.model.Usuario;
import java.util.List;
import java.util.Optional;
import org.springframework.web.multipart.MultipartFile;

public interface IUsuarioService {

	Usuario crearUsuario(Usuario usuario);

	Usuario actualizarUsuario(Integer id, Usuario usuarioActualizado);

	List<Usuario> listarTodosUsuarios();

	Optional<Usuario> buscarUsuarioPorId(Integer id);

	Optional<Usuario> buscarUsuarioPorNombres(String nombres);

	Optional<Usuario> buscarUsuarioPorCorreo(String correo);

	Optional<Usuario> buscarUsuarioPorDocumento(String numDocumento);

	List<Usuario> buscarUsuariosPorRol(Integer rolId);

	List<Usuario> buscarUsuariosPorNombresOApellidos(String nombres, String apellidos);

	boolean existeCorreo(String correo);

	boolean existeDocumento(String numDocumento);

	boolean existeNombres(String nombres);

	// NUEVOS MÉTODOS PARA ADMIN

	Usuario activarUsuario(Integer id);

	Usuario desactivarUsuario(Integer id);

	Usuario asignarRol(Integer id, Integer rolId);

	void eliminarUsuario(Integer id);

	// LOGIN

	/**
	 * Valida las credenciales de un usuario usando correo y contraseña.
	 * 
	 * @param correo   correo electrónico del usuario
	 * @param password contraseña en texto plano para validar
	 * @return true si las credenciales son válidas, false en caso contrario
	 */
	boolean validarCredencialesPorCorreo(String correo, String password);

	void save(Usuario usuario);

	void actualizarPassword(Integer usuarioId, String nuevaPassword);

	void eliminarFotoPerfil(Long usuarioId);

	void actualizarFotoPerfil(Long usuarioId, String rutaFoto);

	String guardarFoto(Long usuarioId, MultipartFile foto);

}