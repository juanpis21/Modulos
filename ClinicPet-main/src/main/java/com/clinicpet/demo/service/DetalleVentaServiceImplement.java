package com.clinicpet.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

import com.clinicpet.demo.model.DetalleVenta;
import com.clinicpet.demo.repository.IDetalleVentaRepository;

public class DetalleVentaServiceImplement implements IDetalleVentaService {

	@Autowired
	private IDetalleVentaRepository detalleVentaRepository;

	@Override
	public DetalleVenta guardarDetalleVenta(DetalleVenta detalleVenta) {
		return detalleVentaRepository.save(detalleVenta) ;
	}

	@Override
	public List<DetalleVenta> listarDetalleDeVenta() {
		return detalleVentaRepository.findAll();
	}

	@Override
	public Optional<DetalleVenta> buscarDetalleVenta(Integer id) {
		return detalleVentaRepository.findById(id) ;
	}

	@Override
	public void eliminarDetalleVenta(Integer id) {
		detalleVentaRepository.deleteById(id);
	}

	@Override
	public List<DetalleVenta> buscarPorVenta(Integer ventaId) {
		return detalleVentaRepository.findByVentaId(ventaId);
	}

	@Override
	public List<DetalleVenta> buscarPorProducto(Integer productoId) {
		return detalleVentaRepository.findByProductoId(productoId);
	}

	@Override
	public Optional<DetalleVenta> buscarPorVentaYProducto(Integer ventaId, Integer productoId) {
		return detalleVentaRepository.findByVentaIdAndProductoId(ventaId, productoId);
	}

}
