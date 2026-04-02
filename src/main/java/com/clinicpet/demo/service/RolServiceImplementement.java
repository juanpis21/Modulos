package com.clinicpet.demo.service;

import com.clinicpet.demo.model.Rol;
import com.clinicpet.demo.repository.IRolRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class RolServiceImplementement implements IRolService {

	private final IRolRepository rolRepository;

	public RolServiceImplementement(IRolRepository rolRepository) {
		this.rolRepository = rolRepository;
	}

	@Override
	@Transactional
	public Rol save(Rol rol) {
		return rolRepository.save(rol);
	}

	@Override
	@Transactional(readOnly = true)
	public List<Rol> findAll() {
		return rolRepository.findAll();
	}

	@Override
	@Transactional(readOnly = true)
	public Optional<Rol> findById(Integer id) {
		return rolRepository.findById(id);
	}

	@Override
	@Transactional
	public void deleteById(Integer id) {
		rolRepository.deleteById(id);
	}

	@Override
	@Transactional(readOnly = true)
	public Optional<Rol> findByNombre(String nombre) {
		return rolRepository.findByNombre(nombre);
	}

	@Override
	@Transactional(readOnly = true)
	public List<Rol> findByNombreContaining(String nombre) {
		return rolRepository.findByNombreContainingIgnoreCase(nombre);
	}

	@Override
	@Transactional(readOnly = true)
	public boolean existsByNombre(String nombre) {
		return rolRepository.existsByNombre(nombre);
	}

	@Override
	@Transactional(readOnly = true)
	public List<Object[]> contarUsuariosPorRol() {
		return rolRepository.contarUsuariosPorRol();
	}

	@Override
	@Transactional(readOnly = true)
	public List<Rol> findRolesConMasDeNUsuarios(int minUsuarios) {
		return rolRepository.findRolesConMasDeNUsuarios(minUsuarios);
	}

	@Override
	@Transactional(readOnly = true)
	public List<Rol> findRolesOrdenadosPorCantidadUsuarios() {
		return rolRepository.findRolesOrdenadosPorCantidadUsuarios();
	}

	@Override
	@Transactional(readOnly = true)
	public List<Rol> findRolesSinUsuarios() {
		return rolRepository.findRolesSinUsuarios();
	}

	@Override
	@Transactional(readOnly = true)
	public List<Rol> findRolesConUsuariosAsignados() {
		return rolRepository.findRolesConUsuariosAsignados();
	}

	@Override
	@Transactional(readOnly = true)
	public List<Rol> findRolesByIds(List<Integer> ids) {
		return rolRepository.findByIdIn(ids);
	}
}
