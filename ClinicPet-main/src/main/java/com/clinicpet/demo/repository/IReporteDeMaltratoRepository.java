package com.clinicpet.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.clinicpet.demo.model.ReporteMaltrato;

@Repository
public interface IReporteDeMaltratoRepository extends JpaRepository<ReporteMaltrato, Integer> {

	java.util.List<ReporteMaltrato> findByEstado(String estado);

	java.util.List<ReporteMaltrato> findByUsuarioId(Integer usuarioId);

	java.util.List<ReporteMaltrato> findByMascotaId(Integer mascotaId);

	java.util.List<ReporteMaltrato> findByFechaBetween(java.time.LocalDate fechaInicio, java.time.LocalDate fechaFin);

	java.util.List<ReporteMaltrato> findByFechaAfter(java.time.LocalDate fecha);

	java.util.List<ReporteMaltrato> findByFechaBefore(java.time.LocalDate fecha);

	java.util.List<ReporteMaltrato> findByEstadoOrderByFechaAsc(String estado);

	@Query("SELECT r.estado, COUNT(r) FROM ReporteMaltrato r GROUP BY r.estado")
	java.util.List<Object[]> countReportesPorEstado();

	// Reportes recientes ordenados por fecha descendente
	java.util.List<ReporteMaltrato> findByOrderByFechaDesc();

	// Buscar reportes con descripción que contenga texto
	@Query("SELECT r FROM ReporteMaltrato r WHERE LOWER(r.descripcion) LIKE LOWER(CONCAT('%', :texto, '%'))")
	java.util.List<ReporteMaltrato> buscarPorDescripcion(@Param("texto") String texto);

	java.util.List<ReporteMaltrato> findByUsuarioIdAndEstado(Integer usuarioId, String estado);

	boolean existsByMascotaId(Integer mascotaId);
}
