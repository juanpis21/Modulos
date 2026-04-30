package com.clinicpet.demo.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

@Entity
@Table(name = "usuarios")
public class Usuario {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(nullable = false, length = 100)
	private String nombres;

	@Column(nullable = false, length = 100)
	private String apellidos;

	@Column(nullable = false, unique = true, length = 150)
	private String correo;

	@Column(name = "tipo_documento", nullable = false, length = 20)
	private String tipoDocumento;

	@Column(name = "num_documento", nullable = false, unique = true, length = 50)
	private String numDocumento;

	@Column(nullable = false, length = 20)
	private String telefono;

	@Column(nullable = false)
	private Integer edad;

	@Column(nullable = false, length = 255)
	private String password;

	@Column(nullable = false, columnDefinition = "TINYINT(1)")
	private boolean activo = true; // para aprobar/desaprobar usuarios

	@Column(length = 255)
	private String direccion;

	@Column(name = "imagen")
	private String imagen;

	// Relación con rol
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "rol_id")
	private Rol rol;

	// Relación con mascotas
	@OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	private List<Mascota> mascotas = new ArrayList<>();

	// constructor vacio
	public Usuario() {

	}

	public Usuario(Integer id, String nombres, String apellidos, String correo, String tipoDocumento,
			String numDocumento, String telefono, Integer edad, String password, boolean activo, String direccion,
			String imagen, Rol rol, List<Mascota> mascotas) {
		super();
		this.id = id;
		this.nombres = nombres;
		this.apellidos = apellidos;
		this.correo = correo;
		this.tipoDocumento = tipoDocumento;
		this.numDocumento = numDocumento;
		this.telefono = telefono;
		this.edad = edad;
		this.password = password;
		this.activo = activo;
		this.direccion = direccion;
		this.imagen = imagen;
		this.rol = rol;
		this.mascotas = mascotas;
	}

	// getters y setters

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getNombres() {
		return nombres;
	}

	public void setNombres(String nombres) {
		this.nombres = nombres;
	}

	public String getApellidos() {
		return apellidos;
	}

	public void setApellidos(String apellidos) {
		this.apellidos = apellidos;
	}

	public String getCorreo() {
		return correo;
	}

	public void setCorreo(String correo) {
		this.correo = correo;
	}

	public String getTipoDocumento() {
		return tipoDocumento;
	}

	public void setTipoDocumento(String tipoDocumento) {
		this.tipoDocumento = tipoDocumento;
	}

	public String getNumDocumento() {
		return numDocumento;
	}

	public void setNumDocumento(String numDocumento) {
		this.numDocumento = numDocumento;
	}

	public String getTelefono() {
		return telefono;
	}

	public void setTelefono(String telefono) {
		this.telefono = telefono;
	}

	public Integer getEdad() {
		return edad;
	}

	public void setEdad(Integer edad) {
		this.edad = edad;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public boolean isActivo() {
		return activo;
	}

	public void setActivo(boolean activo) {
		this.activo = activo;
	}

	public String getDireccion() {
		return direccion;
	}

	public void setDireccion(String direccion) {
		this.direccion = direccion;
	}

	public String getImagen() {
		return imagen;
	}

	public void setImagen(String imagen) {
		this.imagen = imagen;
	}

	public Rol getRol() {
		return rol;
	}

	public void setRol(Rol rol) {
		this.rol = rol;
	}

	public List<Mascota> getMascotas() {
		return mascotas;
	}

	public void setMascotas(List<Mascota> mascotas) {
		this.mascotas = mascotas;
	}

	@Override
	public String toString() {
		return "Usuario [id=" + id + ", nombres=" + nombres + ", apellidos=" + apellidos + ", correo=" + correo
				+ ", tipoDocumento=" + tipoDocumento + ", numDocumento=" + numDocumento + ", telefono=" + telefono
				+ ", edad=" + edad + ", password=" + password + ", activo=" + activo + ", direccion=" + direccion
				+ ", imagen=" + imagen + "]";

	}
}