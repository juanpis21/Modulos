package com.clinicpet.demo.service;

import com.clinicpet.demo.model.Rol;

import java.util.List;
import java.util.Optional;

public interface IRolService {

	Rol save(Rol rol);

	List<Rol> findAll();

	Optional<Rol> findById(Integer id);

	void deleteById(Integer id);

	Optional<Rol> findByNombre(String nombre);

	List<Rol> findByNombreContaining(String nombre);

	boolean existsByNombre(String nombre);

	List<Object[]> contarUsuariosPorRol();

	List<Rol> findRolesConMasDeNUsuarios(int minUsuarios);

	List<Rol> findRolesOrdenadosPorCantidadUsuarios();

	List<Rol> findRolesSinUsuarios();

	List<Rol> findRolesConUsuariosAsignados();

	List<Rol> findRolesByIds(List<Integer> ids);
}
