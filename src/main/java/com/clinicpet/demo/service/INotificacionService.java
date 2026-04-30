package com.clinicpet.demo.service;

import java.util.List;
import java.util.Optional;

import com.clinicpet.demo.model.Notificacion;

public interface INotificacionService {

	// Guardar/actualizar una notificación
	public Notificacion guardarNotificacion(Notificacion notificacion);

	// Obtener todas las notificaciones
	public List<Notificacion> obtenerTodasLasNotificaciones();

	// Obtener notificación por ID
	public Optional<Notificacion> obtenerNotificacionPorId(Integer id);

	// Eliminar notificación por ID
	public void eliminarNotificacion(Integer id);

	public List<Notificacion> obtenerNotificacionesPorUsuario(Integer usuarioId);

	public List<Notificacion> obtenerNotificacionesPorUsuarioYEstado(Integer usuarioId, String estado);

	public List<Notificacion> obtenerNotificacionesPorUsuarioYTipo(Integer usuarioId, String tipo);

	public List<Notificacion> obtenerNotificacionesRecientesPorUsuario(Integer usuarioId);

	public List<Notificacion> obtenerNotificacionesPorUsuarioYEstadoOrdenadas(Integer usuarioId, String estado);

	// gestión de notificaciones
	public Notificacion marcarComoLeida(Integer notificacionId);

	public Notificacion marcarComoNoLeida(Integer notificacionId);

	public void marcarTodasComoLeidas(Integer usuarioId);

	public int contarNotificacionesNoLeidas(Integer usuarioId);

	// crear notificaciones automáticamente
	public Notificacion crearNotificacion(Integer usuarioId, String mensaje, String tipo);

}
