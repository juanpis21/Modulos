package com.clinicpet.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "veterinariaveterinario")
public class VeterinariaVeterinario {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@ManyToOne
	@JoinColumn(name = "idVeterinaria")
	private Veterinaria veterinaria;

	@ManyToOne
	@JoinColumn(name = "idUsuarioVeterinario")
	private Usuario veterinario;

	public VeterinariaVeterinario() {

	}

	public VeterinariaVeterinario(Integer id, Veterinaria veterinaria, Usuario veterinario) {
		super();
		this.id = id;
		this.veterinaria = veterinaria;
		this.veterinario = veterinario;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Veterinaria getVeterinaria() {
		return veterinaria;
	}

	public void setVeterinaria(Veterinaria veterinaria) {
		this.veterinaria = veterinaria;
	}

	public Usuario getVeterinario() {
		return veterinario;
	}

	public void setVeterinario(Usuario veterinario) {
		this.veterinario = veterinario;
	}

	@Override
	public String toString() {
		return "VeterinariaVeterinario [id=" + id + "]";
	}

}
