package com.clinicpet.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clinicpet.demo.model.Carrito;
import com.clinicpet.demo.model.Carrito.EstadoCarrito;
import com.clinicpet.demo.model.Usuario;
import com.clinicpet.demo.repository.ICarritoRepository;
import com.clinicpet.demo.repository.IUsuarioRepository;

@Service
public class CarritoServiceImplement implements ICarritoService {

	@Autowired
	private ICarritoRepository carritoRepository;

	@Autowired
	private IUsuarioRepository usuarioRepository;

	@Override
	public List<Carrito> listarCarritos() {
		// TODO Auto-generated method stub
		return carritoRepository.findAll();
	}

	@Override
	public Optional<Carrito> obtenerCarritoPorId(Integer id) {
		// TODO Auto-generated method stub
		return carritoRepository.findById(id);
	}

	@Override
	public Optional<Carrito> obtenerCarritoActivoUsuario(Integer usuarioId) {
		// TODO Auto-generated method stub
		return carritoRepository.findByUsuarioIdAndEstado(usuarioId, EstadoCarrito.ACTIVO);
	}

	@Override
	public List<Carrito> obtenerCarritosPorUsuario(Integer usuarioId) {
		// TODO Auto-generated method stub
		return carritoRepository.findByUsuarioId(usuarioId);
	}

	@Override
	public List<Carrito> obtenerCarritosPorEstado(EstadoCarrito estado) {
		// TODO Auto-generated method stub
		return carritoRepository.findByEstado(estado);
	}

	@Override
	public Carrito crearCarrito(Carrito carrito) {
		// TODO Auto-generated method stub
		return carritoRepository.save(carrito);
	}

	@Override
	public Carrito actualizarCarrito(Integer id, Carrito carrito) {
		// TODO Auto-generated method stub
		return carritoRepository.findById(id).map(carritoExistente -> {
			carritoExistente.setEstado(carrito.getEstado());
			carritoExistente.setUsuario(carrito.getUsuario());
			return carritoRepository.save(carritoExistente);
		}).orElseThrow(() -> new RuntimeException("Carrito no encontrado con ID: " + id));
	}

	@Override
	public void eliminarCarrito(Integer id) {
		// TODO Auto-generated method stub
		carritoRepository.deleteById(id);

	}

	@Override
	public Carrito crearCarritoParaUsuario(Integer usuarioId) {
		// TODO Auto-generated method stub
		Optional<Carrito> carritoExistente = carritoRepository.findByUsuarioIdAndEstado(usuarioId,
				EstadoCarrito.ACTIVO);

		if (carritoExistente.isPresent()) {
			return carritoExistente.get();
		}

		// Crear nuevo carrito
		Usuario usuario = usuarioRepository.findById(usuarioId)
				.orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + usuarioId));

		Carrito nuevoCarrito = new Carrito();
		nuevoCarrito.setEstado(EstadoCarrito.ACTIVO);
		nuevoCarrito.setUsuario(usuario);

		return carritoRepository.save(nuevoCarrito);
	}

	@Override
	public Carrito confirmarCarrito(Integer usuarioId) {
		// TODO Auto-generated method stub
		Carrito carrito = carritoRepository.findByUsuarioIdAndEstado(usuarioId, EstadoCarrito.ACTIVO)
				.orElseThrow(() -> new RuntimeException("No existe carrito activo para el usuario: " + usuarioId));

		carrito.setEstado(EstadoCarrito.COMPRADO);
		return carritoRepository.save(carrito);
	}

	@Override
	public void cancelarCarrito(Integer usuarioId) {
		// TODO Auto-generated method stub
		Carrito carrito = carritoRepository.findByUsuarioIdAndEstado(usuarioId, EstadoCarrito.ACTIVO)
				.orElseThrow(() -> new RuntimeException("No existe carrito activo para el usuario: " + usuarioId));

		carrito.setEstado(EstadoCarrito.CANCELADO);
		carritoRepository.save(carrito);
	}

	// metodo auxiliar para calcular el total
	public Double calcularTotalCarrito(Integer carritoId) {
		return 0.0;
	}

}