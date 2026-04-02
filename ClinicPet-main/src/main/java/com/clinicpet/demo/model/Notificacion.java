package com.clinicpet.demo.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Notificacion")
public class Notificacion {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	private String mensaje;
	private String tipo;
	private String estado;
	private LocalDateTime fecha;

	@ManyToOne
	@JoinColumn(name = "idUsuario", nullable = false)
	private Usuario usuario;

	// constructor vacio
	public Notificacion() {

	}

	// constructor con campos
	public Notificacion(Integer id, String mensaje, String tipo, String estado, LocalDateTime fecha, Usuario usuario) {
		super();
		this.id = id;
		this.mensaje = mensaje;
		this.tipo = tipo;
		this.estado = estado;
		this.fecha = fecha;
		this.usuario = usuario;
	}

	// getters & setters
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getMensaje() {
		return mensaje;
	}

	public void setMensaje(String mensaje) {
		this.mensaje = mensaje;
	}

	public String getTipo() {
		return tipo;
	}

	public void setTipo(String tipo) {
		this.tipo = tipo;
	}

	public String getEstado() {
		return estado;
	}

	public void setEstado(String estado) {
		this.estado = estado;
	}

	public LocalDateTime getFecha() {
		return fecha;
	}

	public void setFecha(LocalDateTime fecha) {
		this.fecha = fecha;
	}

	public Usuario getUsuario() {
		return usuario;
	}

	public void setUsuario(Usuario usuario) {
		this.usuario = usuario;
	}

	// to string
	@Override
	public String toString() {
		return "Notificacion [id=" + id + ", mensaje=" + mensaje + ", tipo=" + tipo + ", estado=" + estado + ", fecha="
				+ fecha + ", usuario=" + usuario + "]";
	}

}
