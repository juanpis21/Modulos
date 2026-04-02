package com.clinicpet.demo.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clinicpet.demo.model.Mascota;
import com.clinicpet.demo.repository.IMascotaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class MascotaServiceImplement implements IMascotaService {

	@Autowired
	private IMascotaRepository mascotaRepository;

	private static final Logger LOGGER = LoggerFactory.getLogger(MascotaServiceImplement.class);

	@Override
	@Transactional
	public Mascota actualizarMascota(Mascota mascota) {
		System.out.println("=== SERVICE: Iniciando actualización ===");
		System.out.println("ID: " + mascota.getId());
		System.out.println("Nombre: " + mascota.getNombre());

		if (mascota == null || mascota.getId() == null) {
			throw new RuntimeException("Mascota e ID requeridos para actualización");
		}

		// Verifica existencia
		Optional<Mascota> existing = mascotaRepository.findById(mascota.getId());
		if (existing.isEmpty()) {
			throw new RuntimeException("Mascota no encontrada para actualizar");
		}

		// Actualiza campos (mantén FK usuario por defecto)
		Mascota toUpdate = existing.get();

		// ✅ Actualizar campos básicos
		if (mascota.getNombre() != null && !mascota.getNombre().trim().isEmpty())
			toUpdate.setNombre(mascota.getNombre().trim());

		if (mascota.getEspecie() != null && !mascota.getEspecie().trim().isEmpty())
			toUpdate.setEspecie(mascota.getEspecie().trim());

		if (mascota.getEdad() != null)
			toUpdate.setEdad(mascota.getEdad());

		if (mascota.getRaza() != null && !mascota.getRaza().trim().isEmpty())
			toUpdate.setRaza(mascota.getRaza().trim());

		if (mascota.getGenero() != null)
			toUpdate.setGenero(mascota.getGenero());

		if (mascota.getTamaño() != null)
			toUpdate.setTamaño(mascota.getTamaño());

		if (mascota.getDescripcion() != null && !mascota.getDescripcion().trim().isEmpty())
			toUpdate.setDescripcion(mascota.getDescripcion().trim());

		// ✅ IMPORTANTE: Solo actualizar foto si viene una nueva (no null)
		if (mascota.getFoto() != null && !mascota.getFoto().trim().isEmpty()) {
			toUpdate.setFoto(mascota.getFoto());
			System.out.println("SERVICE: Actualizando foto a: " + mascota.getFoto());
		} else {
			System.out.println("SERVICE: Manteniendo foto actual: " + toUpdate.getFoto());
		}

		if (mascota.getUnidadEdad() != null && !mascota.getUnidadEdad().trim().isEmpty()) {
			toUpdate.setUnidadEdad(mascota.getUnidadEdad().trim());
			System.out.println("SERVICE: Actualizando unidad edad a: " + mascota.getUnidadEdad());
		} else {
			System.out.println("SERVICE: Manteniendo unidad edad actual: " + toUpdate.getUnidadEdad());
		}

		// ✅ NO tocar el usuario, ya está asociado en toUpdate
		System.out.println("SERVICE: Usuario asociado ID: " + toUpdate.getUsuario().getId());

		// Guardar
		Mascota updated = mascotaRepository.save(toUpdate);
		System.out.println("=== SERVICE: Mascota actualizada exitosamente ===");
		System.out.println("ID: " + updated.getId());
		System.out.println("Edad final: " + updated.getEdad() + " " + updated.getUnidadEdad());
		return updated;
	}

	@Override
	public Mascota guardarMascota(Mascota mascota) {
		return mascotaRepository.save(mascota);
	}

	@Override
	public List<Mascota> listarMascotas() {
		List<Mascota> mascotas = mascotaRepository.findAll();
		return mascotas != null ? mascotas : new ArrayList<>();
	}

	public Optional<Mascota> buscarMascotaPorId(Integer id) {
		return mascotaRepository.findById(id);
	}

	@Override
	public List<Mascota> buscarPorUsuario(Integer usuarioId) {
		List<Mascota> mascotas = mascotaRepository.findByUsuario_Id(usuarioId);
		return mascotas != null ? mascotas : new ArrayList<>();
	}

	@Override
	public List<Mascota> buscarPorEspecie(String especie) {
		if (especie == null || especie.trim().isEmpty()) {
			return new ArrayList<>();
		}
		List<Mascota> mascotas = mascotaRepository.findByEspecie(especie.trim());
		return mascotas != null ? mascotas : new ArrayList<>();
	}

	@Override
	@Transactional
	public void eliminarMascota(Integer id) {
		LOGGER.info("Intentando eliminar mascota con ID: {}", id);

		if (mascotaRepository.existsById(id)) {
			// Usar eliminación nativa
			mascotaRepository.eliminarMascotaPorId(id);
			LOGGER.info("Mascota eliminada exitosamente con ID: {}", id);
		} else {
			LOGGER.warn("No se encontró mascota con ID: {} para eliminar", id);
			throw new RuntimeException("Mascota no encontrada con ID: " + id);
		}
	}

}