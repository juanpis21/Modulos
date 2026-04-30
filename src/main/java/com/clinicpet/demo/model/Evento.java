package com.clinicpet.demo.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Evento")
public class Evento {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	private String titulo;
	private String descripcion;
	private LocalDate fechainicio;
	private LocalDate fechafin;
	private String imagen;

	@ManyToOne
	@JoinColumn(name = "idveterinaria", nullable = false)
	private Veterinaria veterinaria;

	// constructor vacio
	public Evento() {

	}

	// constructor con campos
	public Evento(Integer id, String titulo, String descripcion, LocalDate fechainicio, LocalDate fechafin,
			String imagen, Veterinaria veterinaria) {
		super();
		this.id = id;
		this.titulo = titulo;
		this.descripcion = descripcion;
		this.fechainicio = fechainicio;
		this.fechafin = fechafin;
		this.imagen = imagen;
		this.veterinaria = veterinaria;
	}

	// getters & setters
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getTitulo() {
		return titulo;
	}

	public void setTitulo(String titulo) {
		this.titulo = titulo;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public LocalDate getFechainicio() {
		return fechainicio;
	}

	public void setFechainicio(LocalDate fechainicio) {
		this.fechainicio = fechainicio;
	}

	public LocalDate getFechafin() {
		return fechafin;
	}

	public void setFechafin(LocalDate fechafin) {
		this.fechafin = fechafin;
	}

	public String getImagen() {
		return imagen;
	}

	public void setImagen(String imagen) {
		this.imagen = imagen;
	}

	public Veterinaria getVeterinaria() {
		return veterinaria;
	}

	public void setVeterinaria(Veterinaria veterinaria) {
		this.veterinaria = veterinaria;
	}

	// to string
	@Override
	public String toString() {
		return "Evento [id=" + id + ", titulo=" + titulo + ", descripcion=" + descripcion + ", fechainicio="
				+ fechainicio + ", fechafin=" + fechafin + ", imagen=" + imagen + ", veterinaria=" + veterinaria + "]";
	}

}
