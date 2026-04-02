package com.clinicpet.demo.model;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import org.springframework.web.multipart.MultipartFile;

@Entity
@Table(name = "adopcion")
public class Adopcion {

	public static final String ESTADO_DISPONIBLE = "DISPONIBLE";
	public static final String ESTADO_EN_PROCESO = "EN_PROCESO";
	public static final String ESTADO_ADOPTADO = "ADOPTADO";

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	// Relación OPCIONAL con mascota (puede ser null porque tenemos campos duplicados)
	@ManyToOne
	@JoinColumn(name = "idMascota", nullable = true)
	private Mascota mascota;

	// Campos de la mascota duplicados para independencia
	private String nombreMascota;
	private String tipoMascota;
	private String raza;
	private Integer edad;
	private String genero;
	private String tamano;
	private String descripcion;
	private String contacto;
	private String imagen = "default.jpg";
	private String estado = ESTADO_DISPONIBLE;
	private Date fechaPublicacion = new Date();

	@Transient
	private MultipartFile archivoImagen;

	// Relación con el usuario que publica la mascota
	@ManyToOne
	@JoinColumn(name = "usuario_id", nullable = false)
	private Usuario usuario;

	// Relación con la veterinaria donde está la mascota (opcional)
	@ManyToOne
	@JoinColumn(name = "veterinaria_id")
	private Veterinaria veterinaria;

	// Constructores
	public Adopcion() {
	}

	// Getters y Setters
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Mascota getMascota() {
		return mascota;
	}

	public void setMascota(Mascota mascota) {
		this.mascota = mascota;
	}

	public String getNombreMascota() {
		return nombreMascota;
	}

	public void setNombreMascota(String nombreMascota) {
		this.nombreMascota = nombreMascota;
	}

	public String getTipoMascota() {
		return tipoMascota;
	}

	public void setTipoMascota(String tipoMascota) {
		this.tipoMascota = tipoMascota;
	}

	public String getRaza() {
		return raza;
	}

	public void setRaza(String raza) {
		this.raza = raza;
	}

	public Integer getEdad() {
		return edad;
	}

	public void setEdad(Integer edad) {
		this.edad = edad;
	}

	public String getGenero() {
		return genero;
	}

	public void setGenero(String genero) {
		this.genero = genero;
	}

	public String getTamano() {
		return tamano;
	}

	public void setTamano(String tamano) {
		this.tamano = tamano;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public String getContacto() {
		return contacto;
	}

	public void setContacto(String contacto) {
		this.contacto = contacto;
	}

	public String getImagen() {
		return imagen;
	}

	public void setImagen(String imagen) {
		this.imagen = imagen;
	}

	public String getEstado() {
		return estado;
	}

	public void setEstado(String estado) {
		this.estado = estado;
	}

	public Date getFechaPublicacion() {
		return fechaPublicacion;
	}

	public void setFechaPublicacion(Date fechaPublicacion) {
		this.fechaPublicacion = fechaPublicacion;
	}

	public MultipartFile getArchivoImagen() {
		return archivoImagen;
	}

	public void setArchivoImagen(MultipartFile archivoImagen) {
		this.archivoImagen = archivoImagen;
	}

	public Usuario getUsuario() {
		return usuario;
	}

	public void setUsuario(Usuario usuario) {
		this.usuario = usuario;
	}

	public Veterinaria getVeterinaria() {
		return veterinaria;
	}

	public void setVeterinaria(Veterinaria veterinaria) {
		this.veterinaria = veterinaria;
	}

	public boolean estaDisponible() {
		return ESTADO_DISPONIBLE.equals(this.estado);
	}

	public boolean estaEnProceso() {
		return ESTADO_EN_PROCESO.equals(this.estado);
	}

	public boolean estaAdoptada() {
		return ESTADO_ADOPTADO.equals(this.estado);
	}

	public void marcarComoEnProceso(Usuario adoptante) {
		if (estaDisponible()) {
			this.estado = ESTADO_EN_PROCESO;
		}
	}

	public void marcarComoAdoptado() {
		if (estaEnProceso()) {
			this.estado = ESTADO_ADOPTADO;
		}
	}

	public void cancelarProcesoAdopcion() {
		this.estado = ESTADO_DISPONIBLE;
	}

	@Override
	public String toString() {
		return "Adopcion{" + "id=" + id + ", nombreMascota='" + nombreMascota + '\'' + ", tipoMascota='" + tipoMascota
				+ '\'' + ", raza='" + raza + '\'' + ", estado='" + estado + '\'';
	}
}