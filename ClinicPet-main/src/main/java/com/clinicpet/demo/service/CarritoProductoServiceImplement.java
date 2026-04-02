package com.clinicpet.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clinicpet.demo.model.CarritoProducto;
import com.clinicpet.demo.repository.ICarritoProducto;

@Service
public class CarritoProductoServiceImplement implements ICarritoProductoService {

	@Autowired
	private ICarritoProducto carritoProductoRepository;

//CRUD

	@Override
	public CarritoProducto guardarCarritoPrroducto(CarritoProducto carritoProducto) {
		return carritoProductoRepository.save(carritoProducto);
	}

	@Override
	public List<CarritoProducto> listarCarritoProductos(CarritoProducto carritoProducto) {
		return carritoProductoRepository.findAll();
	}

	@Override
	public Optional<CarritoProducto> buscarPorId(Integer id) {
		return carritoProductoRepository.findById(id);
	}

	@Override
	public void eliminarCarritoProducto(Integer id) {
		carritoProductoRepository.deleteById(id);
	}

//METODOS PERSONALIZADOS 

//buscar por carrito
	@Override
	public List<CarritoProducto> buscarPorCarrito(Integer carritoId) {
		return carritoProductoRepository.findByCarritoId(carritoId);
	}

//buscar por carrito y producto
	@Override
	public List<CarritoProducto> buscarPorCarritoYProducto(Integer carridtoId, Integer productoId) {
		return carritoProductoRepository.findByCarritoIdAndProductoId(carridtoId, productoId);
	}

//buscar por producto
	@Override
	public List<CarritoProducto> buscarPorProducto(Integer productoId) {
		return carritoProductoRepository.findByProductoId(productoId);
	}
}
