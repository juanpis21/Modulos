package com.clinicpet.demo.repository;

import com.clinicpet.demo.model.TokenRecuperacion;
import com.clinicpet.demo.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface ITokenRecuperacionRepository extends JpaRepository<TokenRecuperacion, Integer> {

	Optional<TokenRecuperacion> findByToken(String token);

	List<TokenRecuperacion> findByUsuario(Usuario usuario);

	List<TokenRecuperacion> findByUsuarioId(Integer usuarioId);

	Optional<TokenRecuperacion> findByUsuarioAndToken(Usuario usuario, String token);

	List<TokenRecuperacion> findByFechaExpiracionBefore(Date fecha);

	List<TokenRecuperacion> findByFechaExpiracionAfter(Date fecha);

	@Query("SELECT t FROM TokenRecuperacion t WHERE t.token = :token AND t.fechaExpiracion > :fechaActual")
	Optional<TokenRecuperacion> findTokenValido(@Param("token") String token, @Param("fechaActual") Date fechaActual);

	@Query("SELECT t FROM TokenRecuperacion t WHERE t.usuario = :usuario AND t.fechaExpiracion > :fechaActual ORDER BY t.fechaExpiracion DESC")
	List<TokenRecuperacion> findTokensValidosByUsuario(@Param("usuario") Usuario usuario,
			@Param("fechaActual") Date fechaActual);

	@Modifying
	@Query("DELETE FROM TokenRecuperacion t WHERE t.fechaExpiracion <= :fechaActual")
	void eliminarTokensExpirados(@Param("fechaActual") Date fechaActual);

	@Modifying
	@Query("DELETE FROM TokenRecuperacion t WHERE t.usuario = :usuario")
	void eliminarTokensByUsuario(@Param("usuario") Usuario usuario);

	@Modifying
	@Query("DELETE FROM TokenRecuperacion t WHERE t.token = :token")
	void eliminarByToken(@Param("token") String token);

	@Query("SELECT COUNT(t) > 0 FROM TokenRecuperacion t WHERE t.usuario = :usuario AND t.fechaExpiracion > :fechaActual")
	boolean existeTokenActivo(@Param("usuario") Usuario usuario, @Param("fechaActual") Date fechaActual);

	@Query("SELECT COUNT(t) FROM TokenRecuperacion t WHERE t.usuario = :usuario AND t.fechaExpiracion > :fechaActual")
	int contarTokensActivos(@Param("usuario") Usuario usuario, @Param("fechaActual") Date fechaActual);
}
