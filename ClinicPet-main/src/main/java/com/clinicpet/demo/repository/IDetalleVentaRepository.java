package com.clinicpet.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.clinicpet.demo.model.DetalleVenta;

@Repository
public interface IDetalleVentaRepository extends JpaRepository<DetalleVenta, Integer> {

	// buscar los detalles de una venta especifica
	List<DetalleVenta> findByVentaId(Integer ventaId);

	// buscar los detalles de un producto esecifico
	List<DetalleVenta> findByProductoId(Integer productoId);

	// buscar detalles de un producto dentro de una venta especifica
	Optional<DetalleVenta> findByVentaIdAndProductoId(Integer ventaId, Integer productoId);

}
