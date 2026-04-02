package com.clinicpet.demo.model;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
@Table(name = "tokenrecuperacion")
public class TokenRecuperacion {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@ManyToOne
	@JoinColumn(name = "IdUsuario")
	private Usuario usuario;

	private String token;

	@Temporal(TemporalType.TIMESTAMP)
	private Date fechaExpiracion;

	public TokenRecuperacion() {

	}

	public TokenRecuperacion(Integer id, Usuario usuario, String token, Date fechaExpiracion) {
		super();
		this.id = id;
		this.usuario = usuario;
		this.token = token;
		this.fechaExpiracion = fechaExpiracion;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Usuario getUsuario() {
		return usuario;
	}

	public void setUsuario(Usuario usuario) {
		this.usuario = usuario;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public Date getFechaExpiracion() {
		return fechaExpiracion;
	}

	public void setFechaExpiracion(Date fechaExpiracion) {
		this.fechaExpiracion = fechaExpiracion;
	}

	@Override
	public String toString() {
		return "TokenRecuperacion [id=" + id + ", fechaExpiracion=" + fechaExpiracion + "]";
	}

}
