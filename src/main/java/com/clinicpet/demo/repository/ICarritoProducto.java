package com.clinicpet.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.clinicpet.demo.model.CarritoProducto;

@Repository
public interface ICarritoProducto extends JpaRepository<CarritoProducto, Integer> {

	// buscar todos los productos de un carritoespecifico
	List<CarritoProducto> findByCarritoId(Integer carritoId);

	// buscar un producto especifico
	List<CarritoProducto> findByCarritoIdAndProductoId(Integer carritoId, Integer productoId);

	// buscar un producto en muchos carritos
	List<CarritoProducto> findByProductoId(Integer productoId);
}
