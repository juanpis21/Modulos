package com.clinicpet.demo.model;

import java.util.Date;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
@Table(name = "venta")
public class Venta {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	private Double subtotal;
	private Double total;

	@ManyToOne
	@JoinColumn(name = "idUsuario")
	private Usuario usuario;

	@Temporal(TemporalType.TIMESTAMP)
	private Date fecha;

	@OneToMany(mappedBy = "venta", cascade = CascadeType.ALL)
	private List<DetalleVenta> detallesVenta;

	@OneToOne(mappedBy = "venta", cascade = CascadeType.ALL)
	private Pago pago;

	public Venta() {

	}

	public Venta(Integer id, Usuario usuario, Date fecha, Double subtotal, Double total,
			List<DetalleVenta> detallesVenta, Pago pago) {
		super();
		this.id = id;
		this.usuario = usuario;
		this.fecha = fecha;
		this.subtotal = subtotal;
		this.total = total;
		this.detallesVenta = detallesVenta;
		this.pago = pago;
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

	public Date getFecha() {
		return fecha;
	}

	public void setFecha(Date fecha) {
		this.fecha = fecha;
	}

	public Double getSubtotal() {
		return subtotal;
	}

	public void setSubtotal(Double subtotal) {
		this.subtotal = subtotal;
	}

	public Double getTotal() {
		return total;
	}

	public void setTotal(Double total) {
		this.total = total;
	}

	public List<DetalleVenta> getDetallesVenta() {
		return detallesVenta;
	}

	public void setDetallesVenta(List<DetalleVenta> detallesVenta) {
		this.detallesVenta = detallesVenta;
	}

	public Pago getPago() {
		return pago;
	}

	public void setPago(Pago pago) {
		this.pago = pago;
	}

	@Override
	public String toString() {
		return "Venta [id=" + id + ", usuario=" + usuario + ", fecha=" + fecha + ", subtotal=" + subtotal + ", total="
				+ total + "]";
	}

}