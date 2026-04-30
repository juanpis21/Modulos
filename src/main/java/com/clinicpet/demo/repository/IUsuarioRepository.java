package com.clinicpet.demo.repository;

import com.clinicpet.demo.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IUsuarioRepository extends JpaRepository<Usuario, Integer> {

	// Buscar por nombres, correo o documento (búsquedas exactas)
	Optional<Usuario> findByNombres(String nombres);

	Optional<Usuario> findByCorreo(String correo);

	Optional<Usuario> findByNumDocumento(String numDocumento);

	// *** CORRECCIÓN BÁSICA: AGREGADO para búsqueda parcial en nombres (resuelve el
	// error en service) ***
	// Búsqueda LIKE '%nombres%' – útil para parcial (ej. "Juan" en "Juan Pérez")
	Optional<Usuario> findByNombresContaining(String nombres);

	// Buscar por nombre o apellido (búsqueda parcial OR)
	List<Usuario> findByNombresContainingOrApellidosContaining(String nombres, String apellidos);

	// Verificar existencia (exactas)
	boolean existsByNombres(String nombres);

	boolean existsByCorreo(String correo);

	boolean existsByNumDocumento(String numDocumento);

	// *** OPCIONAL: AGREGADO si necesitas verificación parcial (para existeNombres
	// en service) ***
	// boolean existsByNombresContaining(String nombres); // LIKE '%nombres%'

	// Buscar por rol (asumiendo campo rol.id en Usuario)
	List<Usuario> findByRolId(Integer rolId);

	// Buscar usuarios por múltiples roles
	List<Usuario> findByRolIdIn(List<Integer> rolIds);

	// Contar usuarios por roles
	long countByRolIdIn(List<Integer> rolIds);

	// Buscar por dirección (parcial)
	List<Usuario> findByDireccionContaining(String direccion);

	// Buscar usuarios que tengan al menos 1 mascota (asumiendo @OneToMany en
	// mascotas)
	List<Usuario> findByMascotasIsNotEmpty();

	Optional<Usuario> findByCorreoAndPassword(String correo, String password);

	// Otros métodos estándar de JpaRepository (ya disponibles: findAll, save,
	// deleteById, etc.)
}