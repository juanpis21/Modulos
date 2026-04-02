package com.clinicpet.demo.service;

import com.clinicpet.demo.model.Veterinaria;
import com.clinicpet.demo.repository.IVeterinariaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class VeterinariaServiceImplement implements IVeterinariaService {

	@Autowired
	private IVeterinariaRepository repo;

	@Override
	public Veterinaria save(Veterinaria v) {
		return repo.save(v);
	}

	@Override
	public Veterinaria findById(Integer id) {
		return repo.findById(id).orElseThrow(() -> new RuntimeException("Veterinaria no encontrada"));
	}

	@Override
	public List<Veterinaria> findAll() {
		return repo.findAll();
	}

	@Override
	public Veterinaria update(Veterinaria v) {
		if (!repo.existsById(v.getId())) {
			throw new RuntimeException("Veterinaria no existe");
		}
		return repo.save(v);
	}

	@Override
	public void deleteById(Integer id) {
		repo.deleteById(id);
	}

	/* ========== ÚTILES SIMPLES ========== */
	@Override
	public boolean existsByNombre(String nombre) {
		return repo.existsByNombre(nombre);
	}

	@Override
	public boolean existsByCorreo(String correo) {
		return repo.existsByCorreo(correo);
	}

	@Override
	public long countTotalVeterinarias() {
		return repo.count();
	}

	@Override
	public Optional<Veterinaria> obtenerPorId(Integer id) {
	    return repo.findById(id);
	}

	@Override
	public List<Veterinaria> listarPorEstado(String estado) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Veterinaria> listarPendientes() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Veterinaria desactivarVeterinaria(Integer id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Veterinaria activarVeterinaria(Integer id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Veterinaria> listarAprobadas() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Veterinaria aprobarVeterinaria(Integer id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Veterinaria rechazarVeterinaria(Integer id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Optional<Veterinaria> findByNombre(String nombre) {
		// TODO Auto-generated method stub
		return Optional.empty();
	}

	@Override
	public List<Veterinaria> findByNombreContainingIgnoreCase(String nombre) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Veterinaria> findByDireccionContainingIgnoreCase(String direccion) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Optional<Veterinaria> findByCorreo(String correo) {
		// TODO Auto-generated method stub
		return Optional.empty();
	}

	@Override
	public Optional<Veterinaria> findByTelefono(String telefono) {
		// TODO Auto-generated method stub
		return Optional.empty();
	}

	@Override
	public boolean existsByTelefono(String telefono) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public List<Veterinaria> findByCiudad(String ciudad) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Veterinaria> findByServicioNombre(String servicio) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Veterinaria> findByHorarioContaining(String horario) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Veterinaria> findAllOrderByNombreAsc() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Veterinaria> findByDescripcionContainingIgnoreCase(String descripcion) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Veterinaria> searchByMultipleFields(String keyword) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public boolean validateVeterinariaData(Veterinaria veterinaria) {
		// TODO Auto-generated method stub
		return false;
	}
}