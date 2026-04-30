package com.clinicpet.demo.repository;

import com.clinicpet.demo.model.Servicio;
import com.clinicpet.demo.model.Veterinaria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IServicioRepository extends JpaRepository<Servicio, Integer> {

	Optional<Servicio> findByNombre(String nombre);

	List<Servicio> findByNombreContainingIgnoreCase(String nombre);

	List<Servicio> findByDescripcionContainingIgnoreCase(String descripcion);

	List<Servicio> findByPrecioBaseBetween(Double precioMin, Double precioMax);

	List<Servicio> findByPrecioBaseGreaterThanEqual(Double precio);

	List<Servicio> findByPrecioBaseLessThanEqual(Double precio);

	List<Servicio> findByVeterinaria(Veterinaria veterinaria);

	List<Servicio> findByVeterinariaId(Integer veterinariaId);

	Optional<Servicio> findByNombreAndVeterinaria(String nombre, Veterinaria veterinaria);


	@Query("SELECT s FROM Servicio s LEFT JOIN s.calificaciones cal GROUP BY s ORDER BY AVG(COALESCE(cal.puntuacion, 0)) DESC")
	List<Servicio> findServiciosMejorCalificados();

	@Query("SELECT s FROM Servicio s WHERE s.veterinaria = :veterinaria AND s.precioBase <= :precioMax")
	List<Servicio> findByVeterinariaAndPrecioMax(@Param("veterinaria") Veterinaria veterinaria,
			@Param("precioMax") Double precioMax);

	@Query("SELECT s FROM Servicio s WHERE LOWER(s.nombre) LIKE LOWER(CONCAT('%', :texto, '%')) OR LOWER(s.descripcion) LIKE LOWER(CONCAT('%', :texto, '%'))")
	List<Servicio> buscarPorNombreODescripcion(@Param("texto") String texto);

	@Query("SELECT COUNT(s) FROM Servicio s WHERE s.veterinaria = :veterinaria")
	Long countByVeterinaria(@Param("veterinaria") Veterinaria veterinaria);

	boolean existsByNombreAndVeterinaria(String nombre, Veterinaria veterinaria);

	@Query("SELECT s FROM Servicio s WHERE s.precioBase < (SELECT AVG(s2.precioBase) FROM Servicio s2 WHERE s2.veterinaria = s.veterinaria)")
	List<Servicio> findServiciosConDescuento();
}
