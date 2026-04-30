package com.clinicpet.demo.repository;

import com.clinicpet.demo.model.Adopcion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IAdopcionRepository extends JpaRepository<Adopcion, Integer> {

	// Buscar adopciones por estado
	List<Adopcion> findByEstado(String estado);

	// Buscar adopciones por estado con paginación
	Page<Adopcion> findByEstado(String estado, Pageable pageable);

	// Buscar adopciones disponibles excluyendo las del usuario actual
	@Query("SELECT a FROM Adopcion a WHERE a.estado = :estado AND a.usuario.id != :usuarioId")
	Page<Adopcion> findByEstadoAndUsuarioIdNot(@Param("estado") String estado, @Param("usuarioId") Integer usuarioId,
			Pageable pageable);

	// Buscar adopciones por veterinaria
	List<Adopcion> findByVeterinariaId(Integer idVeterinaria);

	// Buscar adopciones por usuario
	List<Adopcion> findByUsuarioId(Integer idUsuario);

	// Buscar adopciones por usuario con paginación
	Page<Adopcion> findByUsuarioId(Integer idUsuario, Pageable pageable);

	// Búsqueda con múltiples filtros
	@Query("SELECT a FROM Adopcion a WHERE "
			+ "(:tipoMascota IS NULL OR LOWER(a.tipoMascota) LIKE LOWER(concat('%', :tipoMascota, '%'))) "
			+ "AND (:raza IS NULL OR LOWER(a.raza) LIKE LOWER(concat('%', :raza, '%'))) "
			+ "AND (:tamano IS NULL OR LOWER(a.tamano) = LOWER(:tamano)) " + "AND a.estado = 'DISPONIBLE'")
	Page<Adopcion> buscarConFiltros(@Param("tipoMascota") String tipoMascota, @Param("raza") String raza,
			@Param("tamano") String tamano, Pageable pageable);
	
	//para las tarjetas de estadidisticas
	long countByEstado(String estado);
}