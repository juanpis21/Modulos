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
@Table(name = "cita")
public class Cita {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	private String motivo;
	private LocalDateTime fechaHora;

	@ManyToOne
	@JoinColumn(name = "idUsuario", nullable = false)
	private Usuario usuario;

	@ManyToOne
	@JoinColumn(name = "idVeterinario", nullable = false)
	private PerfilVeterinario veterinario;

	@ManyToOne
	@JoinColumn(name = "idMascota", nullable = false)
	private Mascota mascota;

	@ManyToOne
	@JoinColumn(name = "idHistoriaClinica")
	private HistoriaClinica historiaClinica;

	// constructor vacio
	public Cita() {
	}

	

	public Cita(Integer id, String motivo, LocalDateTime fechaHora, Usuario usuario, PerfilVeterinario veterinario,
			Mascota mascota, HistoriaClinica historiaClinica) {
		super();
		this.id = id;
		this.motivo = motivo;
		this.fechaHora = fechaHora;
		this.usuario = usuario;
		this.veterinario = veterinario;
		this.mascota = mascota;
		this.historiaClinica = historiaClinica;
	}



	public Integer getId() {
		return id;
	}



	public void setId(Integer id) {
		this.id = id;
	}



	public String getMotivo() {
		return motivo;
	}



	public void setMotivo(String motivo) {
		this.motivo = motivo;
	}



	public LocalDateTime getFechaHora() {
		return fechaHora;
	}



	public void setFechaHora(LocalDateTime fechaHora) {
		this.fechaHora = fechaHora;
	}



	public Usuario getUsuario() {
		return usuario;
	}



	public void setUsuario(Usuario usuario) {
		this.usuario = usuario;
	}



	public PerfilVeterinario getVeterinario() {
		return veterinario;
	}



	public void setVeterinario(PerfilVeterinario veterinario) {
		this.veterinario = veterinario;
	}



	public Mascota getMascota() {
		return mascota;
	}



	public void setMascota(Mascota mascota) {
		this.mascota = mascota;
	}



	public HistoriaClinica getHistoriaClinica() {
		return historiaClinica;
	}



	public void setHistoriaClinica(HistoriaClinica historiaClinica) {
		this.historiaClinica = historiaClinica;
	}



	@Override
	public String toString() {
		return "Cita [id=" + id + ", motivo=" + motivo + ", fechaHora=" + fechaHora + "]";
	}

}
