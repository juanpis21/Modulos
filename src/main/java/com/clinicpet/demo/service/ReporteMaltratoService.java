package com.clinicpet.demo.service;

import com.clinicpet.demo.model.ReporteMaltrato;
import com.clinicpet.demo.repository.IReporteDeMaltratoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ReporteMaltratoService implements IReporteMaltratoService {

	@Autowired
	private IReporteDeMaltratoRepository reporteMaltratoRepository;

	@Override
	public ReporteMaltrato crearReporteMaltrato(ReporteMaltrato reporteMaltrato) {
		return reporteMaltratoRepository.save(reporteMaltrato);
	}

	@Override
	public Optional<ReporteMaltrato> obtenerReporteMaltratoPorId(Integer id) {
		return reporteMaltratoRepository.findById(id);
	}

	@Override
	public List<ReporteMaltrato> obtenerTodosLosReportesMaltrato() {
		return reporteMaltratoRepository.findAll();
	}

	@Override
	public ReporteMaltrato actualizarReporteMaltrato(Integer id, ReporteMaltrato reporteMaltrato) {
		if (reporteMaltratoRepository.existsById(id)) {
			reporteMaltrato.setId(id);
			return reporteMaltratoRepository.save(reporteMaltrato);
		}
		return null;
	}

	@Override
	public void eliminarReporteMaltrato(Integer id) {
		reporteMaltratoRepository.deleteById(id);
	}

	@Override
	public List<ReporteMaltrato> obtenerReportesMaltratoPorEstado(String estado) {
		return reporteMaltratoRepository.findByEstado(estado);
	}

	@Override
	public List<ReporteMaltrato> obtenerReportesMaltratoPorUsuarioId(Integer usuarioId) {
		return reporteMaltratoRepository.findByUsuarioId(usuarioId);
	}

	@Override
	public List<ReporteMaltrato> obtenerReportesMaltratoPorMascotaId(Integer mascotaId) {
		return reporteMaltratoRepository.findByMascotaId(mascotaId);
	}

	@Override
	public List<ReporteMaltrato> obtenerReportesMaltratoPorRangoFechas(LocalDate fechaInicio, LocalDate fechaFin) {
		return reporteMaltratoRepository.findByFechaBetween(fechaInicio, fechaFin);
	}

	@Override
	public List<ReporteMaltrato> obtenerReportesMaltratoDespuesDeFecha(LocalDate fecha) {
		return reporteMaltratoRepository.findByFechaAfter(fecha);
	}

	@Override
	public List<ReporteMaltrato> obtenerReportesMaltratoAntesDeFecha(LocalDate fecha) {
		return reporteMaltratoRepository.findByFechaBefore(fecha);
	}

	@Override
	public List<ReporteMaltrato> obtenerReportesMaltratoPendientes(String estado) {
		return reporteMaltratoRepository.findByEstadoOrderByFechaAsc(estado);
	}

	@Override
	public List<ReporteMaltrato> obtenerReportesMaltratoRecientes() {
		return reporteMaltratoRepository.findByOrderByFechaDesc();
	}

	@Override
	public List<ReporteMaltrato> buscarReportesMaltratoPorDescripcion(String texto) {
		return reporteMaltratoRepository.buscarPorDescripcion(texto);
	}

	@Override
	public List<ReporteMaltrato> obtenerReportesMaltratoPorUsuarioYEstado(Integer usuarioId, String estado) {
		return reporteMaltratoRepository.findByUsuarioIdAndEstado(usuarioId, estado);
	}

	@Override
	public boolean existeReporteMaltratoPorMascotaId(Integer mascotaId) {
		return reporteMaltratoRepository.existsByMascotaId(mascotaId);
	}
}