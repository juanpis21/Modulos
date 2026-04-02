package com.clinicpet.demo.model;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "servicio")
public class Servicio {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	private String nombre;
	private String descripcion;
	private Double precioBase;

	@ManyToOne
	@JoinColumn(name = "idVeterinaria")
	private Veterinaria veterinaria;

	@OneToMany(mappedBy = "servicio", cascade = CascadeType.ALL)
	private List<Calificacion> calificaciones;

	public Servicio() {

	}


	public Servicio(Integer id, String nombre, String descripcion, Double precioBase, Veterinaria veterinaria,
			List<Calificacion> calificaciones) {
		super();
		this.id = id;
		this.nombre = nombre;
		this.descripcion = descripcion;
		this.precioBase = precioBase;
		this.veterinaria = veterinaria;
		this.calificaciones = calificaciones;
	}


	public Integer getId() {
		return id;
	}


	public void setId(Integer id) {
		this.id = id;
	}


	public String getNombre() {
		return nombre;
	}


	public void setNombre(String nombre) {
		this.nombre = nombre;
	}


	public String getDescripcion() {
		return descripcion;
	}


	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}


	public Double getPrecioBase() {
		return precioBase;
	}


	public void setPrecioBase(Double precioBase) {
		this.precioBase = precioBase;
	}


	public Veterinaria getVeterinaria() {
		return veterinaria;
	}


	public void setVeterinaria(Veterinaria veterinaria) {
		this.veterinaria = veterinaria;
	}


	public List<Calificacion> getCalificaciones() {
		return calificaciones;
	}


	public void setCalificaciones(List<Calificacion> calificaciones) {
		this.calificaciones = calificaciones;
	}


	@Override
	public String toString() {
		return "Servicio [id=" + id + ", nombre=" + nombre + ", descripcion=" + descripcion + ", precioBase="
				+ precioBase + "]";
	}

}
