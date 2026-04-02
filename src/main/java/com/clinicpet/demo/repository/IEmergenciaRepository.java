package com.clinicpet.demo.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.clinicpet.demo.model.Emergencia;

/**
 * Repositorio para la gestión de EMERGENCIAS VETERINARIAS en la base de datos.
 * 
 * Extiende JpaRepository para proporcionar operaciones CRUD básicas y métodos
 * de consulta personalizados para buscar emergencias según diferentes criterios.
 * 
 * Métodos heredados de JpaRepository:
 * - save(Emergencia) - Guardar o actualizar una emergencia
 * - findById(Integer) - Buscar emergencia por ID
 * - findAll() - Obtener todas las emergencias
 * - deleteById(Integer) - Eliminar emergencia por ID
 * - existsById(Integer) - Verificar si existe una emergencia
 * 
 * @author HelpYourPet Team
 * @version 1.0
 */
@Repository
public interface IEmergenciaRepository extends JpaRepository<Emergencia, Integer> {

	/**
	 * Busca todas las emergencias de un tipo específico.
	 * 
	 * Tipos válidos: "accidente", "enfermedad", "intoxicacion", "parto", "cirugia", "otro"
	 * 
	 * @param tipo Tipo de emergencia a buscar
	 * @return Lista de emergencias que coinciden con el tipo especificado
	 * 
	 * Ejemplo de uso:
	 * List<Emergencia> accidentes = repository.findByTipo("accidente");
	 */
	List<Emergencia> findByTipo(String tipo);

	/**
	 * Busca todas las emergencias asociadas a una mascota específica.
	 * 
	 * Utiliza la notación de Spring Data JPA para navegar por la relación:
	 * Mascota_Id accede al campo 'id' de la entidad 'mascota' relacionada.
	 * 
	 * @param mascotaId ID de la mascota
	 * @return Lista de todas las emergencias de la mascota especificada
	 * 
	 * Ejemplo de uso:
	 * List<Emergencia> emergenciasMascota = repository.findByMascota_Id(5);
	 */
	List<Emergencia> findByMascota_Id(Integer mascotaId);

	/**
	 * Busca todas las emergencias atendidas por un veterinario específico.
	 * 
	 * Utiliza la notación de Spring Data JPA para navegar por la relación:
	 * Veterinario_Id accede al campo 'id' de la entidad 'veterinario' relacionada.
	 * 
	 * @param veterinarioId ID del veterinario
	 * @return Lista de todas las emergencias atendidas por el veterinario
	 * 
	 * Ejemplo de uso:
	 * List<Emergencia> emergenciasVet = repository.findByVeterinario_Id(3);
	 */
	List<Emergencia> findByVeterinario_Id(Integer veterinarioId);

	/**
	 * Busca emergencias de una mascota específica dentro de un rango de fechas.
	 * 
	 * Este método combina dos criterios de búsqueda:
	 * 1. Mascota específica (por ID)
	 * 2. Rango de fechas (entre fecha inicio y fecha fin)
	 * 
	 * Útil para obtener el historial de emergencias de una mascota en un período específico.
	 * 
	 * @param mascotaId ID de la mascota
	 * @param inicio Fecha y hora de inicio del rango (inclusive)
	 * @param fin Fecha y hora de fin del rango (inclusive)
	 * @return Lista de emergencias de la mascota en el rango de fechas especificado
	 * 
	 * Ejemplo de uso:
	 * LocalDateTime inicio = LocalDateTime.now().minusDays(30);
	 * LocalDateTime fin = LocalDateTime.now();
	 * List<Emergencia> emergenciasUltimoMes = repository.findByMascota_IdAndFechayhoraBetween(5, inicio, fin);
	 */
	List<Emergencia> findByMascota_IdAndFechayhoraBetween(Integer mascotaId, LocalDateTime inicio, LocalDateTime fin);
}
