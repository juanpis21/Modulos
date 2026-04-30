package com.clinicpet.demo.model;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "producto")
public class Producto {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	private String nombre;
	private String descripcion;
	private Double precio;
	private String imagen;
	private String categoria;

	@OneToMany(mappedBy = "producto")
	private List<DetalleVenta> detalle;

	// constructor vacio
	public Producto() {
	}
	// constructor con campos

	public Integer getId() {
		return id;
	}

	public Producto(Integer id, String nombre, String descripcion, Double precio, String imagen, String categoria,
			List<DetalleVenta> detalle) {
		super();
		this.id = id;
		this.nombre = nombre;
		this.descripcion = descripcion;
		this.precio = precio;
		this.imagen = imagen;
		this.categoria = categoria;
		this.detalle = detalle;
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

	public Double getPrecio() {
		return precio;
	}

	public void setPrecio(Double precio) {
		this.precio = precio;
	}

	public String getImagen() {
		return imagen;
	}

	public void setImagen(String imagen) {
		this.imagen = imagen;
	}

	public String getCategoria() {
		return categoria;
	}

	public void setCategoria(String categoria) {
		this.categoria = categoria;
	}

	public List<DetalleVenta> getDetalle() {
		return detalle;
	}

	public void setDetalle(List<DetalleVenta> detalle) {
		this.detalle = detalle;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	@Override
	public String toString() {
		return "Producto [id=" + id + ", nombre=" + nombre + ", descripcion=" + descripcion + ", precio=" + precio
				+ ", imagen=" + imagen + ", categoria=" + categoria + "]";
	}

}
