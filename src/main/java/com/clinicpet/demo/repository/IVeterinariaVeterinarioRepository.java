package com.clinicpet.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.clinicpet.demo.model.Usuario;
import com.clinicpet.demo.model.Veterinaria;
import com.clinicpet.demo.model.VeterinariaVeterinario;

import jakarta.transaction.Transactional;

@Repository
public interface IVeterinariaVeterinarioRepository extends JpaRepository<VeterinariaVeterinario, Integer> {

    @Query("SELECT vv.veterinario FROM VeterinariaVeterinario vv WHERE vv.veterinaria.id = :veterinariaId")
    List<Usuario> findVeterinariosByVeterinariaId(@Param("veterinariaId") Integer veterinariaId);

    @Query("SELECT vv.veterinaria FROM VeterinariaVeterinario vv WHERE vv.veterinario.id = :veterinarioId")
    List<Veterinaria> findVeterinariasByVeterinarioId(@Param("veterinarioId") Integer veterinarioId);

    Optional<VeterinariaVeterinario> findByVeterinaria_IdAndVeterinario_Id(Integer veterinariaId, Integer veterinarioId);

    boolean existsByVeterinaria_IdAndVeterinario_Id(Integer veterinariaId, Integer veterinarioId);

    long countByVeterinaria_Id(Integer veterinariaId);

    long countByVeterinario_Id(Integer veterinarioId);

    @Transactional
    @Modifying
    void deleteByVeterinaria_Id(Integer veterinariaId);

    @Transactional
    @Modifying
    void deleteByVeterinario_Id(Integer veterinarioId);

    @Query("SELECT vv.veterinaria.id FROM VeterinariaVeterinario vv WHERE vv.veterinario.id = :veterinarioId")
    List<Integer> findVeterinariaIdsByVeterinarioId(@Param("veterinarioId") Integer veterinarioId);

    @Query("SELECT vv.veterinario.id FROM VeterinariaVeterinario vv WHERE vv.veterinaria.id = :veterinariaId")
    List<Integer> findVeterinarioIdsByVeterinariaId(@Param("veterinariaId") Integer veterinariaId);
}
