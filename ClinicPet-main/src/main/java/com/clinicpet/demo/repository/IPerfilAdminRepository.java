package com.clinicpet.demo.repository;

import com.clinicpet.demo.model.PerfilAdmin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IPerfilAdminRepository extends JpaRepository<PerfilAdmin, Integer> {

	Optional<PerfilAdmin> findByUsuarioId(Integer usuarioId);

	PerfilAdmin findByCorreo(String correo);

	Optional<PerfilAdmin> findByCedula(String cedula);

	// Contar total de administradores
	long count();

	List<PerfilAdmin> findByNombresContaining(String nombres);

	List<PerfilAdmin> findByApellidosContaining(String apellidos);
}