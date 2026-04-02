package com.clinicpet.demo.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "perfilveterinario")
public class PerfilVeterinario {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	private String especialidad;
	private String tarjetaProfesional;
	
	@Column(columnDefinition = "TINYINT(1)")
	private Boolean estado; // false: inactivo por defecto hasta que el admin lo apruebe
	private String experiencia;

	// Relación con Usuario
	@OneToOne
	@JoinColumn(name = "usuario_id")
	private Usuario usuario;

	// Relación con citas
	@OneToMany(mappedBy = "veterinario")
	private List<Cita> citas;

	// relacion con veterinaria
	@ManyToOne
	@JoinColumn(name = "veterinaria_id")
	private Veterinaria veterinaria;

	// constructor vacio
	public PerfilVeterinario() {
		this.estado = false; // inactivo hasta aprobacion

	}

	// constructor con campos
	public PerfilVeterinario(Integer id, String especialidad, String tarjetaProfesional, Boolean estado,
			String experiencia, Usuario usuario, List<Cita> citas, Veterinaria veterinaria) {
		super();
		this.id = id;
		this.especialidad = especialidad;
		this.tarjetaProfesional = tarjetaProfesional;
		this.estado = estado;
		this.experiencia = experiencia;
		this.usuario = usuario;
		this.citas = citas;
		this.veterinaria = veterinaria;
	}

	// getters y setters
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getEspecialidad() {
		return especialidad;
	}

	public void setEspecialidad(String especialidad) {
		this.especialidad = especialidad;
	}

	public String getTarjetaProfesional() {
		return tarjetaProfesional;
	}

	public void setTarjetaProfesional(String tarjetaProfesional) {
		this.tarjetaProfesional = tarjetaProfesional;
	}

	public Boolean getEstado() {
		return estado;
	}

	public void setEstado(Boolean estado) {
		this.estado = estado;
	}

	public String getExperiencia() {
		return experiencia;
	}

	public void setExperiencia(String experiencia) {
		this.experiencia = experiencia;
	}

	public Usuario getUsuario() {
		return usuario;
	}

	public void setUsuario(Usuario usuario) {
		this.usuario = usuario;
	}

	public List<Cita> getCitas() {
		return citas;
	}

	public void setCitas(List<Cita> citas) {
		this.citas = citas;
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
		return "PerfilVeterinario [id=" + id + ", especialidad=" + especialidad + ", tarjetaProfesional="
				+ tarjetaProfesional + ", estado=" + estado + ", experiencia=" + experiencia + "]";
	}

}