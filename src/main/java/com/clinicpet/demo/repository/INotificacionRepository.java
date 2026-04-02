package com.clinicpet.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.clinicpet.demo.model.Notificacion;
@Repository
public interface INotificacionRepository extends JpaRepository<Notificacion, Integer>{
	
	// Busca todas las notificaciones de un usuario
    List<Notificacion> findByUsuario_Id(Integer usuarioId);

    List<Notificacion> findByUsuario_IdAndEstado(Integer usuarioId, String estado);

    List<Notificacion> findByUsuario_IdAndTipo(Integer usuarioId, String tipo);

    // Busca notificaciones recientes de un usuario ordenadas por fecha desc
    List<Notificacion> findByUsuario_IdOrderByFechaDesc(Integer usuarioId);

    // Busca todas las notificaciones con un estado específico ordenadas de la más reciente a la más antigua
    List<Notificacion> findByUsuario_IdAndEstadoOrderByFechaDesc(Integer usuarioId, String estado);

}



