package com.clinicpet.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "carritoproducto")
public class CarritoProducto {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	private Integer cantidad;

	@ManyToOne
	@JoinColumn(name = "idCarrito", nullable = false)
	private Carrito carrito;

	@ManyToOne
	@JoinColumn(name = "idProducto", nullable = false)
	private Producto producto;

	// constructor vacio
	public CarritoProducto() {
	}
	// costructor con campos

	public CarritoProducto(Integer id, Integer cantidad, Carrito carrito, Producto producto) {
		super();
		this.id = id;
		this.cantidad = cantidad;
		this.carrito = carrito;
		this.producto = producto;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getCantidad() {
		return cantidad;
	}

	public void setCantidad(Integer cantidad) {
		this.cantidad = cantidad;
	}

	public Carrito getCarrito() {
		return carrito;
	}

	public void setCarrito(Carrito carrito) {
		this.carrito = carrito;
	}

	public Producto getProducto() {
		return producto;
	}

	public void setProducto(Producto producto) {
		this.producto = producto;
	}

	@Override
	public String toString() {
		return "CarritoProducto [id=" + id + ", cantidad=" + cantidad + "]";
	}

}
