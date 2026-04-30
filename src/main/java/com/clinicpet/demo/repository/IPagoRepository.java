package com.clinicpet.demo.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.clinicpet.demo.model.Pago;
@Repository
public interface IPagoRepository  extends JpaRepository<Pago, Integer>{
	
	// Buscar el pago de una venta
    Optional<Pago> findByVenta_Id(Integer ventaId);

    // Buscar pagos por estado
    List<Pago> findByEstado(String estado);

    // Buscar pagos por método
    List<Pago> findByMetodo(String metodo);

    // Buscar pagos en un rango de fechas
    List<Pago> findByFechaPagoBetween(LocalDateTime inicio, LocalDateTime fin);

    // Buscar pagos de un cliente a través de la venta → usuario
    List<Pago> findByVenta_Usuario_Id(Integer usuarioId);

}



 
