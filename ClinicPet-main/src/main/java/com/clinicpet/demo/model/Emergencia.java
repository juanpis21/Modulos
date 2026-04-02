package com.clinicpet.demo.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * Entidad que representa una EMERGENCIA VETERINARIA en el sistema.
 * 
 * Esta clase modela situaciones de emergencia que requieren atención inmediata
 * para las mascotas registradas en el sistema. Cada emergencia está asociada a:
 * - Una mascota específica que requiere atención
 * - Un veterinario que atiende la emergencia
 * - Una veterinaria donde se registra/atiende la emergencia
 * 
 * @author HelpYourPet Team
 * @version 1.0
 */
@Entity
@Table(name = "Emergencia")
public class Emergencia {

	/**
	 * Identificador único de la emergencia en la base de datos.
	 * Se genera automáticamente mediante estrategia IDENTITY.
	 */
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	/**
	 * Tipo de emergencia registrada.
	 * Valores permitidos: "accidente", "enfermedad", "intoxicacion", "parto", "cirugia", "otro"
	 * Este campo es obligatorio y se valida en el servicio.
	 */
	private String tipo;
	
	/**
	 * Fecha y hora en que ocurrió o se registró la emergencia.
	 * Si no se especifica, se asigna automáticamente la fecha/hora actual.
	 */
	private LocalDateTime fechayhora;
	
	/**
	 * Descripción detallada de la emergencia.
	 * Debe incluir síntomas, situación actual y cualquier información relevante.
	 * Este campo es obligatorio.
	 */
	private String descripcion;

	/**
	 * Mascota que presenta la emergencia.
	 * Relación Many-to-One: Muchas emergencias pueden pertenecer a una mascota.
	 * Este campo es obligatorio (nullable = false).
	 */
	@ManyToOne
	@JoinColumn(name = "idMascota", nullable = false)
	private Mascota mascota;

	/**
	 * Veterinario que atiende o registra la emergencia.
	 * Relación Many-to-One: Un veterinario puede atender múltiples emergencias.
	 * Este campo es obligatorio (nullable = false).
	 */
	@ManyToOne
	@JoinColumn(name = "idVeterinario", nullable = false)
	private PerfilVeterinario veterinario;

	/**
	 * Veterinaria donde se registra o atiende la emergencia.
	 * Relación Many-to-One: Una veterinaria puede tener múltiples emergencias registradas.
	 * Este campo es obligatorio (nullable = false).
	 */
	@ManyToOne
	@JoinColumn(name = "idVeterinaria", nullable = false)
	private Veterinaria veterinaria;

	/**
	 * Constructor vacío requerido por JPA.
	 * Se utiliza para la creación de instancias por parte del framework.
	 */
	public Emergencia() {

	}

	/**
	 * Constructor completo con todos los campos de la emergencia.
	 * 
	 * @param id Identificador único de la emergencia
	 * @param tipo Tipo de emergencia (accidente, enfermedad, intoxicacion, parto, cirugia, otro)
	 * @param fechayhora Fecha y hora de la emergencia
	 * @param descripcion Descripción detallada de la emergencia
	 * @param mascota Mascota que presenta la emergencia
	 * @param veterinario Veterinario que atiende la emergencia
	 * @param veterinaria Veterinaria donde se registra la emergencia
	 */
	public Emergencia(Integer id, String tipo, LocalDateTime fechayhora, String descripcion, Mascota mascota,
			PerfilVeterinario veterinario, Veterinaria veterinaria) {
		super();
		this.id = id;
		this.tipo = tipo;
		this.fechayhora = fechayhora;
		this.descripcion = descripcion;
		this.mascota = mascota;
		this.veterinario = veterinario;
		this.veterinaria = veterinaria;
	}

	/**
	 * Obtiene el identificador único de la emergencia.
	 * @return ID de la emergencia
	 */
	public Integer getId() {
		return id;
	}

	/**
	 * Establece el identificador único de la emergencia.
	 * @param id ID a asignar
	 */
	public void setId(Integer id) {
		this.id = id;
	}

	/**
	 * Obtiene el tipo de emergencia.
	 * @return Tipo de emergencia (accidente, enfermedad, intoxicacion, parto, cirugia, otro)
	 */
	public String getTipo() {
		return tipo;
	}

	/**
	 * Establece el tipo de emergencia.
	 * @param tipo Tipo a asignar (debe ser uno de los valores permitidos)
	 */
	public void setTipo(String tipo) {
		this.tipo = tipo;
	}

	/**
	 * Obtiene la fecha y hora de la emergencia.
	 * @return Fecha y hora en formato LocalDateTime
	 */
	public LocalDateTime getFechayhora() {
		return fechayhora;
	}

	/**
	 * Establece la fecha y hora de la emergencia.
	 * @param fechayhora Fecha y hora a asignar (no puede ser futura)
	 */
	public void setFechayhora(LocalDateTime fechayhora) {
		this.fechayhora = fechayhora;
	}

	/**
	 * Obtiene la descripción detallada de la emergencia.
	 * @return Descripción de la emergencia
	 */
	public String getDescripcion() {
		return descripcion;
	}

	/**
	 * Establece la descripción detallada de la emergencia.
	 * @param descripcion Descripción a asignar (no puede estar vacía)
	 */
	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	/**
	 * Obtiene la mascota asociada a la emergencia.
	 * @return Mascota que presenta la emergencia
	 */
	public Mascota getMascota() {
		return mascota;
	}

	/**
	 * Establece la mascota asociada a la emergencia.
	 * @param mascota Mascota a asignar (obligatorio)
	 */
	public void setMascota(Mascota mascota) {
		this.mascota = mascota;
	}

	/**
	 * Obtiene el veterinario que atiende la emergencia.
	 * @return Perfil del veterinario asignado
	 */
	public PerfilVeterinario getVeterinario() {
		return veterinario;
	}

	/**
	 * Establece el veterinario que atiende la emergencia.
	 * @param veterinario Veterinario a asignar (obligatorio)
	 */
	public void setVeterinario(PerfilVeterinario veterinario) {
		this.veterinario = veterinario;
	}

	/**
	 * Obtiene la veterinaria donde se registra la emergencia.
	 * @return Veterinaria asociada
	 */
	public Veterinaria getVeterinaria() {
		return veterinaria;
	}

	/**
	 * Establece la veterinaria donde se registra la emergencia.
	 * @param veterinaria Veterinaria a asignar (obligatorio)
	 */
	public void setVeterinaria(Veterinaria veterinaria) {
		this.veterinaria = veterinaria;
	}

	/**
	 * Representación en cadena de texto de la emergencia.
	 * Incluye todos los campos principales para facilitar el debugging.
	 * 
	 * @return String con la información de la emergencia
	 */
	@Override
	public String toString() {
		return "Emergencia [id=" + id + ", tipo=" + tipo + ", fechayhora=" + fechayhora + ", descripcion=" + descripcion
				+ ", mascota=" + mascota + ", veterinario=" + veterinario + "]";
	}

}
