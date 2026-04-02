package com.clinicpet.demo.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clinicpet.demo.model.Inventario;
import com.clinicpet.demo.repository.IInventarioRepository;

@Service
public class InventarioServiceImplement implements IInventarioService {

	@Autowired
	private IInventarioRepository inventarioRepository;

	@Override
	 public Inventario guardarInventario(Inventario inventario) {
		System.out.println("💾 Guardando inventario en BD...");
	    System.out.println("📦 Datos a guardar - Producto ID: " + inventario.getProducto().getId());
	    System.out.println("📦 Datos a guardar - Veterinaria ID: " + inventario.getVeterinaria().getId());
	    System.out.println("📦 Datos a guardar - Cantidad: " + inventario.getCantidadDisponible());
	    
	    Inventario guardado = inventarioRepository.save(inventario);
	    
	    System.out.println("✅ Inventario guardado con ID: " + guardado.getId());
	    return guardado;
    }

	@Override
	public List<Inventario> obtenerTodoElInventario() {
		// TODO Auto-generated method stub
		return inventarioRepository.findAll();
	}

	@Override
	public Optional<Inventario> obtenerInventarioPorId(Integer id) {
		// TODO Auto-generated method stub
		return inventarioRepository.findById(id);
	}

	@Override
	public void eliminarInventario(Integer id) {
		// TODO Auto-generated method stub
		if (!inventarioRepository.existsById(id)) {
			throw new IllegalArgumentException("No existe un registro de inventario con el ID: " + id);
		}
		inventarioRepository.deleteById(id);
	}

	@Override
	public List<Inventario> obtenerInventarioPorVeterinaria(Integer veterinariaId) {
		// TODO Auto-generated method stub
		   System.out.println("🔍 Buscando inventario para veterinaria ID: " + veterinariaId);
		    List<Inventario> inventarios = inventarioRepository.findByVeterinaria_Id(veterinariaId);
		    System.out.println("📊 Inventarios encontrados: " + inventarios.size());
		    return inventarios;
	}

	@Override
	public List<Inventario> obtenerInventarioPorProducto(Integer productoId) {
		// TODO Auto-generated method stub
		return inventarioRepository.findByProducto_Id(productoId);
	}

	@Override
	 public Inventario obtenerInventarioPorVeterinariaYProducto(Integer veterinariaId, Integer productoId) {
        System.out.println("🔍 Buscando inventario - Veterinaria: " + veterinariaId + ", Producto: " + productoId);
        
        List<Inventario> resultados = inventarioRepository.findByVeterinaria_IdAndProducto_Id(veterinariaId, productoId);
        System.out.println("📊 Resultados encontrados: " + resultados.size());
        
        return resultados.isEmpty() ? null : resultados.get(0);
    }

	@Override
	public List<Inventario> obtenerProductosConStockBajo(Integer cantidadMinima) {
		// TODO Auto-generated method stub
		return inventarioRepository.findByCantidadDisponibleLessThan(cantidadMinima);
	}

	@Override
	public List<Inventario> obtenerProductosConStockSuficiente(Integer cantidadMinima) {
		// TODO Auto-generated method stub
		return inventarioRepository.findByCantidadDisponibleGreaterThanEqual(cantidadMinima);
	}

	@Override
	public Inventario actualizarStock(Integer inventarioId, Integer nuevaCantidad) {
		// TODO Auto-generated method stub
		Inventario inventario = inventarioRepository.findById(inventarioId).orElseThrow(
				() -> new IllegalArgumentException("No existe el registro de inventario con ID: " + inventarioId));
		if (nuevaCantidad < 0) {
			throw new IllegalArgumentException("La cantidad no puede ser negativa.");
		}
		inventario.setCantidadDisponible(nuevaCantidad);
		inventario.setFechaActualizacion(LocalDate.now());
		return inventarioRepository.save(inventario);
	}

	@Override
	public Inventario agregarStock(Integer inventarioId, Integer cantidadAagregar) {
		if (cantidadAagregar <= 0) {
			throw new IllegalArgumentException("La cantidad a agregar debe ser mayor a cero");
		}
		Inventario inventario = inventarioRepository.findById(inventarioId).orElseThrow(
				() -> new IllegalArgumentException("No existe el registro de inventario con ID: " + inventarioId));

		inventario.setCantidadDisponible(inventario.getCantidadDisponible() + cantidadAagregar);
		inventario.actualizarEstado(); // <-- actualizar estado automáticamente
		inventario.setFechaActualizacion(LocalDate.now());
		return inventarioRepository.save(inventario);
	}

	@Override
	public Inventario reducirStock(Integer inventarioId, Integer cantidadAReducir) {
		if (cantidadAReducir <= 0) {
			throw new IllegalArgumentException("La cantidad a reducir debe ser mayor a cero");
		}
		Inventario inventario = inventarioRepository.findById(inventarioId).orElseThrow(
				() -> new IllegalArgumentException("No existe el registro de inventario con ID: " + inventarioId));

		if (inventario.getCantidadDisponible() < cantidadAReducir) {
			throw new IllegalArgumentException("Stock insuficiente. Stock actual: " + inventario.getCantidadDisponible()
					+ ", intentando reducir: " + cantidadAReducir);
		}

		inventario.setCantidadDisponible(inventario.getCantidadDisponible() - cantidadAReducir);
		inventario.actualizarEstado(); // <-- actualizar estado automáticamente
		inventario.setFechaActualizacion(LocalDate.now());
		return inventarioRepository.save(inventario);
	}


	public List<Inventario> obtenerProductosAgotados() {
		return obtenerProductosConStockBajo(1);
	}

	public List<Inventario> obtenerProductosPorAgotarse(Integer limite) {
		return obtenerProductosConStockBajo(limite);
	}
}
