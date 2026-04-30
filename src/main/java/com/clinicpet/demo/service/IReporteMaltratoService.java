package com.clinicpet.demo.service;

import com.clinicpet.demo.model.ReporteMaltrato;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface IReporteMaltratoService {
	ReporteMaltrato crearReporteMaltrato(ReporteMaltrato reporteMaltrato);

	Optional<ReporteMaltrato> obtenerReporteMaltratoPorId(Integer id);

	List<ReporteMaltrato> obtenerTodosLosReportesMaltrato();

	ReporteMaltrato actualizarReporteMaltrato(Integer id, ReporteMaltrato reporteMaltrato);

	void eliminarReporteMaltrato(Integer id);

	List<ReporteMaltrato> obtenerReportesMaltratoPorEstado(String estado);

	List<ReporteMaltrato> obtenerReportesMaltratoPorUsuarioId(Integer usuarioId);

	List<ReporteMaltrato> obtenerReportesMaltratoPorMascotaId(Integer mascotaId);

	List<ReporteMaltrato> obtenerReportesMaltratoPorRangoFechas(LocalDate fechaInicio, LocalDate fechaFin);

	List<ReporteMaltrato> obtenerReportesMaltratoDespuesDeFecha(LocalDate fecha);

	List<ReporteMaltrato> obtenerReportesMaltratoAntesDeFecha(LocalDate fecha);

	List<ReporteMaltrato> obtenerReportesMaltratoPendientes(String estado);

	List<ReporteMaltrato> obtenerReportesMaltratoRecientes();

	List<ReporteMaltrato> buscarReportesMaltratoPorDescripcion(String texto);

	List<ReporteMaltrato> obtenerReportesMaltratoPorUsuarioYEstado(Integer usuarioId, String estado);

	boolean existeReporteMaltratoPorMascotaId(Integer mascotaId);
}