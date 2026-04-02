package com.clinicpet.demo.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clinicpet.demo.model.Emergencia;
import com.clinicpet.demo.repository.IEmergenciaRepository;

/**
 * Implementación del servicio de EMERGENCIAS VETERINARIAS.
 * 
 * Esta clase contiene toda la lógica de negocio para la gestión de emergencias:
 * - Validaciones de datos antes de guardar
 * - Operaciones CRUD completas
 * - Métodos de búsqueda y filtrado
 * - Cálculos de emergencias recientes y urgentes
 * 
 * Todas las validaciones se realizan antes de interactuar con la base de datos
 * para garantizar la integridad de los datos.
 * 
 * @author HelpYourPet Team
 * @version 1.0
 */
@Service
public class EmergenciaServiceImplement implements IEmergenciaService {

	/**
	 * Repositorio para acceso a datos de emergencias.
	 * Inyectado automáticamente por Spring.
	 */
	@Autowired
	private IEmergenciaRepository emergenciaRepository;

	/**
	 * Guarda o actualiza una emergencia en la base de datos.
	 * 
	 * Proceso:
	 * 1. Valida todos los campos obligatorios y reglas de negocio
	 * 2. Si no se especificó fecha/hora, asigna la actual automáticamente
	 * 3. Guarda en la base de datos
	 * 
	 * @param emergencia Emergencia a guardar
	 * @return Emergencia guardada con ID asignado
	 * @throws IllegalArgumentException si las validaciones fallan
	 */
	@Override
	public Emergencia guardarEmergencia(Emergencia emergencia) {
		// Validar todos los campos obligatorios y reglas de negocio
		validarEmergencia(emergencia);
		
		// Si no se especifica fecha y hora, se establece automáticamente la actual
		if (emergencia.getFechayhora() == null) {
			emergencia.setFechayhora(LocalDateTime.now());
		}
		
		// Guardar en base de datos
		return emergenciaRepository.save(emergencia);
	}

	/**
	 * Obtiene todas las emergencias registradas en el sistema.
	 * 
	 * @return Lista completa de emergencias
	 */
	@Override
	public List<Emergencia> obtenerTodasLasEmergencias() {
		return emergenciaRepository.findAll();
	}

	/**
	 * Busca una emergencia específica por su ID.
	 * 
	 * @param id ID de la emergencia
	 * @return Optional con la emergencia si existe, vacío si no
	 */
	@Override
	public Optional<Emergencia> obtenerEmergenciaPorId(Integer id) {
		return emergenciaRepository.findById(id);
	}

	/**
	 * Elimina una emergencia del sistema.
	 * 
	 * Verifica que la emergencia exista antes de eliminarla.
	 * 
	 * @param id ID de la emergencia a eliminar
	 * @throws IllegalArgumentException si no existe la emergencia
	 */
	@Override
	public void eliminarEmergencia(Integer id) {
		// Verificar que la emergencia existe antes de eliminar
		if (!emergenciaRepository.existsById(id)) {
			throw new IllegalArgumentException("No existe una emergencia con el ID: " + id);
		}
		// Eliminar de la base de datos
		emergenciaRepository.deleteById(id);
	}

	/**
	 * Obtiene todas las emergencias de un tipo específico.
	 * 
	 * @param tipo Tipo de emergencia (accidente, enfermedad, etc.)
	 * @return Lista de emergencias del tipo especificado
	 */
	@Override
	public List<Emergencia> obtenerEmergenciasPorTipo(String tipo) {
		return emergenciaRepository.findByTipo(tipo);
	}

	/**
	 * Obtiene el historial completo de emergencias de una mascota.
	 * 
	 * @param mascotaId ID de la mascota
	 * @return Lista de todas las emergencias de la mascota
	 */
	@Override
	public List<Emergencia> obtenerEmergenciasPorMascota(Integer mascotaId) {
		return emergenciaRepository.findByMascota_Id(mascotaId);
	}

	/**
	 * Obtiene todas las emergencias atendidas por un veterinario.
	 * 
	 * @param veterinarioId ID del veterinario
	 * @return Lista de emergencias atendidas por el veterinario
	 */
	@Override
	public List<Emergencia> obtenerEmergenciasPorVeterinario(Integer veterinarioId) {
		return emergenciaRepository.findByVeterinario_Id(veterinarioId);
	}

	/**
	 * Obtiene emergencias de una mascota en un período específico.
	 * 
	 * @param mascotaId ID de la mascota
	 * @param inicio Fecha/hora de inicio del período
	 * @param fin Fecha/hora de fin del período
	 * @return Lista de emergencias de la mascota en el rango de fechas
	 */
	@Override
	public List<Emergencia> obtenerEmergenciasPorMascotaYRangoFechas(Integer mascotaId, LocalDateTime inicio,
			LocalDateTime fin) {
		return emergenciaRepository.findByMascota_IdAndFechayhoraBetween(mascotaId, inicio, fin);
	}

	/**
	 * Obtiene emergencias registradas en las últimas 24 horas.
	 * 
	 * Utiliza Stream API para filtrar emergencias cuya fecha sea posterior
	 * a hace 24 horas desde el momento actual.
	 * 
	 * @return Lista de emergencias de las últimas 24 horas
	 */
	@Override
	public List<Emergencia> obtenerEmergenciasRecientes() {
		// Calcular el momento hace 24 horas
		LocalDateTime hace24Horas = LocalDateTime.now().minusHours(24);
		
		// Filtrar emergencias posteriores a hace 24 horas
		return obtenerTodasLasEmergencias().stream()
				.filter(e -> e.getFechayhora().isAfter(hace24Horas))
				.toList();
	}

	/**
	 * Obtiene todas las emergencias registradas el día actual.
	 * 
	 * Define el rango desde las 00:00:00 hasta las 23:59:59 del día actual
	 * y filtra las emergencias que caen dentro de este rango.
	 * 
	 * @return Lista de emergencias del día de hoy
	 */
	@Override
	public List<Emergencia> obtenerEmergenciasDeHoy() {
		// Definir inicio del día (00:00:00)
		LocalDateTime inicioDelDia = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
		
		// Definir fin del día (23:59:59)
		LocalDateTime finDelDia = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59);
		
		// Filtrar emergencias dentro del rango del día actual
		return obtenerTodasLasEmergencias().stream()
				.filter(e -> !e.getFechayhora().isBefore(inicioDelDia) && !e.getFechayhora().isAfter(finDelDia))
				.toList();
	}

	/**
	 * Obtiene todas las emergencias en un rango de fechas específico.
	 * 
	 * @param inicio Fecha/hora de inicio del rango
	 * @param fin Fecha/hora de fin del rango
	 * @return Lista de emergencias en el rango especificado
	 */
	@Override
	public List<Emergencia> obtenerEmergenciasPorRangoFechas(LocalDateTime inicio, LocalDateTime fin) {
		// Filtrar emergencias dentro del rango de fechas
		return obtenerTodasLasEmergencias().stream()
				.filter(e -> !e.getFechayhora().isBefore(inicio) && !e.getFechayhora().isAfter(fin))
				.toList();
	}

	/**
	 * Método privado para validar todos los campos de una emergencia.
	 * 
	 * Validaciones realizadas:
	 * 1. Tipo de emergencia: obligatorio y debe estar en la lista de tipos permitidos
	 * 2. Descripción: obligatoria y no vacía
	 * 3. Mascota: obligatoria
	 * 4. Veterinario: obligatorio
	 * 5. Veterinaria: obligatoria
	 * 6. Fecha: no puede ser futura
	 * 
	 * @param emergencia Emergencia a validar
	 * @throws IllegalArgumentException si alguna validación falla
	 */
	private void validarEmergencia(Emergencia emergencia) {
		// Validación 1: Tipo de emergencia obligatorio
		if (emergencia.getTipo() == null || emergencia.getTipo().trim().isEmpty()) {
			throw new IllegalArgumentException("El tipo de emergencia es obligatorio");
		}

		// Validación 2: Descripción obligatoria
		if (emergencia.getDescripcion() == null || emergencia.getDescripcion().trim().isEmpty()) {
			throw new IllegalArgumentException("La descripción de la emergencia es obligatoria");
		}

		// Validación 3: Mascota obligatoria
		if (emergencia.getMascota() == null) {
			throw new IllegalArgumentException("La mascota es obligatoria");
		}

		// Validación 4: Veterinario obligatorio
		if (emergencia.getVeterinario() == null) {
			throw new IllegalArgumentException("El veterinario es obligatorio");
		}

		// Validación 5: Veterinaria obligatoria
		if (emergencia.getVeterinaria() == null) {
			throw new IllegalArgumentException("La veterinaria es obligatoria");
		}

		// Validación 6: La fecha no puede ser futura
		if (emergencia.getFechayhora() != null && emergencia.getFechayhora().isAfter(LocalDateTime.now())) {
			throw new IllegalArgumentException("La fecha y hora de la emergencia no puede ser futura");
		}

		// Validación 7: Tipo debe estar en la lista de tipos permitidos
		List<String> tiposPermitidos = List.of("accidente", "enfermedad", "intoxicacion", "parto", "cirugia", "otro");
		if (!tiposPermitidos.contains(emergencia.getTipo().toLowerCase())) {
			throw new IllegalArgumentException(
					"Tipo de emergencia no válido: " + emergencia.getTipo() + ". Tipos permitidos: " + tiposPermitidos);
		}
	}

	/**
	 * Método adicional para obtener emergencias URGENTES.
	 * 
	 * Define como "urgente" las emergencias registradas en las últimas 2 horas,
	 * que requieren atención inmediata.
	 * 
	 * Este método NO está en la interfaz, es específico de esta implementación.
	 * 
	 * @return Lista de emergencias de las últimas 2 horas
	 */
	public List<Emergencia> obtenerEmergenciasUrgentes() {
		// Definir qué se considera "urgente": últimas 2 horas
		LocalDateTime hace2Horas = LocalDateTime.now().minusHours(2);
		
		// Filtrar emergencias posteriores a hace 2 horas
		return obtenerTodasLasEmergencias().stream()
				.filter(e -> e.getFechayhora().isAfter(hace2Horas))
				.toList();
	}

	/**
	 * Método adicional para contar rápidamente las emergencias del día.
	 * 
	 * Útil para estadísticas y dashboards.
	 * Este método NO está en la interfaz, es específico de esta implementación.
	 * 
	 * @return Número total de emergencias registradas hoy
	 */
	public int contarEmergenciasHoy() {
		return obtenerEmergenciasDeHoy().size();
	}

}
