package com.clinicpet.demo.repository;

import com.clinicpet.demo.model.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IRolRepository extends JpaRepository<Rol, Integer> {

	Optional<Rol> findByNombre(String nombre);

	List<Rol> findByNombreContainingIgnoreCase(String nombre);

	List<Rol> findByDescripcionContainingIgnoreCase(String descripcion);

	boolean existsByNombre(String nombre);

	Optional<Rol> findByNombreIgnoreCase(String nombre);

	List<Rol> findByIdIn(List<Integer> ids);

	// CONSULTAS CORREGIDAS (usa 'usuarios' en lugar de 'usuario'):

	@Query("SELECT r.nombre, COUNT(u) FROM Rol r LEFT JOIN r.usuarios u GROUP BY r.id, r.nombre ORDER BY COUNT(u) DESC")
	List<Object[]> contarUsuariosPorRol();

	@Query("SELECT r FROM Rol r WHERE SIZE(r.usuarios) > :minUsuarios")
	List<Rol> findRolesConMasDeNUsuarios(@Param("minUsuarios") int minUsuarios);

	@Query("SELECT r FROM Rol r LEFT JOIN r.usuarios u GROUP BY r.id, r.nombre, r.descripcion ORDER BY COUNT(u) DESC")
	List<Rol> findRolesOrdenadosPorCantidadUsuarios();

	@Query("SELECT r FROM Rol r WHERE r.usuarios IS EMPTY")
	List<Rol> findRolesSinUsuarios();

	@Query("SELECT DISTINCT r FROM Rol r JOIN r.usuarios u")
	List<Rol> findRolesConUsuariosAsignados();
}