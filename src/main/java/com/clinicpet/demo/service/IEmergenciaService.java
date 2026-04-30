package com.clinicpet.demo.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.clinicpet.demo.model.Emergencia;

/**
 * Interfaz de servicio para la gestión de EMERGENCIAS VETERINARIAS.
 * 
 * Define los métodos de negocio para:
 * - Operaciones CRUD básicas (crear, leer, actualizar, eliminar)
 * - Búsquedas especializadas (por tipo, mascota, veterinario, fechas)
 * - Consultas de emergencias recientes y urgentes
 * 
 * Esta capa de servicio encapsula la lógica de negocio y validaciones
 * antes de interactuar con el repositorio de datos.
 * 
 * @author HelpYourPet Team
 * @version 1.0
 */
public interface IEmergenciaService {

	/**
	 * Guarda o actualiza una emergencia en el sistema.
	 * 
	 * Validaciones realizadas:
	 * - Tipo de emergencia obligatorio y válido
	 * - Descripción obligatoria
	 * - Mascota, veterinario y veterinaria obligatorios
	 * - Fecha no puede ser futura
	 * - Si no se especifica fecha, se asigna la actual automáticamente
	 * 
	 * @param emergencia Objeto Emergencia con los datos a guardar
	 * @return Emergencia guardada con ID asignado
	 * @throws IllegalArgumentException si alguna validación falla
	 */
	public Emergencia guardarEmergencia(Emergencia emergencia);

	/**
	 * Obtiene todas las emergencias registradas en el sistema.
	 * 
	 * @return Lista completa de emergencias (puede estar vacía)
	 */
	public List<Emergencia> obtenerTodasLasEmergencias();

	/**
	 * Busca una emergencia específica por su ID.
	 * 
	 * @param id Identificador único de la emergencia
	 * @return Optional con la emergencia si existe, Optional.empty() si no se encuentra
	 */
	public Optional<Emergencia> obtenerEmergenciaPorId(Integer id);

	/**
	 * Elimina una emergencia del sistema.
	 * 
	 * @param id Identificador de la emergencia a eliminar
	 * @throws IllegalArgumentException si no existe una emergencia con el ID especificado
	 */
	public void eliminarEmergencia(Integer id);

	/**
	 * Obtiene todas las emergencias de un tipo específico.
	 * 
	 * Tipos válidos: "accidente", "enfermedad", "intoxicacion", "parto", "cirugia", "otro"
	 * 
	 * @param tipo Tipo de emergencia a buscar
	 * @return Lista de emergencias del tipo especificado
	 */
	public List<Emergencia> obtenerEmergenciasPorTipo(String tipo);

	/**
	 * Obtiene el historial completo de emergencias de una mascota.
	 * 
	 * Útil para ver todas las emergencias que ha tenido una mascota específica.
	 * 
	 * @param mascotaId ID de la mascota
	 * @return Lista de emergencias de la mascota
	 */
	public List<Emergencia> obtenerEmergenciasPorMascota(Integer mascotaId);

	/**
	 * Obtiene todas las emergencias atendidas por un veterinario.
	 * 
	 * Útil para ver el historial de trabajo del veterinario.
	 * 
	 * @param veterinarioId ID del veterinario
	 * @return Lista de emergencias atendidas por el veterinario
	 */
	public List<Emergencia> obtenerEmergenciasPorVeterinario(Integer veterinarioId);

	/**
	 * Obtiene emergencias de una mascota en un período específico.
	 * 
	 * Combina filtros de mascota y rango de fechas para obtener
	 * un historial específico.
	 * 
	 * @param mascotaId ID de la mascota
	 * @param inicio Fecha y hora de inicio del período
	 * @param fin Fecha y hora de fin del período
	 * @return Lista de emergencias de la mascota en el rango especificado
	 */
	public List<Emergencia> obtenerEmergenciasPorMascotaYRangoFechas(Integer mascotaId, LocalDateTime inicio,
			LocalDateTime fin);

	/**
	 * Obtiene emergencias registradas en las últimas 24 horas.
	 * 
	 * Útil para monitorear emergencias recientes y dar seguimiento.
	 * 
	 * @return Lista de emergencias de las últimas 24 horas
	 */
	public List<Emergencia> obtenerEmergenciasRecientes();

	/**
	 * Obtiene todas las emergencias registradas el día actual.
	 * 
	 * Filtra emergencias desde las 00:00:00 hasta las 23:59:59 del día actual.
	 * 
	 * @return Lista de emergencias del día de hoy
	 */
	public List<Emergencia> obtenerEmergenciasDeHoy();

	/**
	 * Obtiene todas las emergencias en un rango de fechas específico.
	 * 
	 * @param inicio Fecha y hora de inicio del rango
	 * @param fin Fecha y hora de fin del rango
	 * @return Lista de emergencias en el rango especificado
	 */
	public List<Emergencia> obtenerEmergenciasPorRangoFechas(LocalDateTime inicio, LocalDateTime fin);
}
