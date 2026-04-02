package com.clinicpet.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "detalleventa")
public class DetalleVenta {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	private Integer cantidad;
	private Double precioUnitario;

	@ManyToOne
	@JoinColumn(name = "idVenta", nullable = false)
	private Venta venta;

	@ManyToOne
	@JoinColumn(name = "idProducto", nullable = false)
	private Producto producto;

	// constructor vacio
	public DetalleVenta() {
	}

	// constructor con campos
	public DetalleVenta(Integer id, Integer cantidad, Double precioUnitario, Venta venta, Producto producto) {
		super();
		this.id = id;
		this.cantidad = cantidad;
		this.precioUnitario = precioUnitario;
		this.venta = venta;
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

	public Double getPrecioUnitario() {
		return precioUnitario;
	}

	public void setPrecioUnitario(Double precioUnitario) {
		this.precioUnitario = precioUnitario;
	}

	public Venta getVenta() {
		return venta;
	}

	public void setVenta(Venta venta) {
		this.venta = venta;
	}

	public Producto getProducto() {
		return producto;
	}

	public void setProducto(Producto producto) {
		this.producto = producto;
	}

	@Override
	public String toString() {
		return "DetalleVenta [id=" + id + ", cantidad=" + cantidad + ", precioUnitario=" + precioUnitario + "]";
	}
}
