package com.clinicpet.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.clinicpet.demo.model.Mascota;

import jakarta.transaction.Transactional;

@Repository
public interface IMascotaRepository extends JpaRepository<Mascota, Integer> {

	// Sin cambios: Método derivado (usa si el mapeo JPA es correcto)
	List<Mascota> findByUsuario_Id(Integer id);

	// Sin cambios: Método derivado
	List<Mascota> findByEspecie(String especie);
	
	List<Mascota> findByUsuarioId(Integer usuarioId);

	@Modifying
	@Transactional
	@Query("DELETE FROM Mascota m WHERE m.id = :id")
	void eliminarMascotaPorId(@Param("id") Integer id);

}