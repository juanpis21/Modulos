package com.clinicpet.demo.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Pago")
public class Pago {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	private String metodo;
	private LocalDateTime fechaPago;
	private String estado;
	private String referencia;

	@OneToOne
	@JoinColumn(name = "idVenta", nullable = false)
	private Venta venta;

	// constructor vacio
	public Pago() {

	}

	// constructor con campos
	public Pago(Integer id, String metodo, LocalDateTime fechaPago, String estado, String referencia, Venta venta) {
		super();
		this.id = id;
		this.metodo = metodo;
		this.fechaPago = fechaPago;
		this.estado = estado;
		this.referencia = referencia;
		this.venta = venta;
	}

	// getters & setters
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getMetodo() {
		return metodo;
	}

	public void setMetodo(String metodo) {
		this.metodo = metodo;
	}

	public LocalDateTime getFechaPago() {
		return fechaPago;
	}

	public void setFechaPago(LocalDateTime fechaPago) {
		this.fechaPago = fechaPago;
	}

	public String getEstado() {
		return estado;
	}

	public void setEstado(String estado) {
		this.estado = estado;
	}

	public String getReferencia() {
		return referencia;
	}

	public void setReferencia(String referencia) {
		this.referencia = referencia;
	}

	public Venta getVenta() {
		return venta;
	}

	public void setVenta(Venta venta) {
		this.venta = venta;
	}

	// to string
	@Override
	public String toString() {
		return "Pago [id=" + id + ", metodo=" + metodo + ", fechaPago=" + fechaPago + ", estado=" + estado
				+ ", referencia=" + referencia + ", venta=" + venta + "]";
	}

}
