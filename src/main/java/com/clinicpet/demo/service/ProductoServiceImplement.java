package com.clinicpet.demo.service;

import com.clinicpet.demo.model.Producto;
import com.clinicpet.demo.repository.IProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProductoServiceImplement implements IProductoService {

	@Autowired
	private IProductoRepository productoRepository;

	@Override
    @Transactional
    public Producto crearProducto(Producto producto) {
        return productoRepository.save(producto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Producto> obtenerProductoPorId(Integer id) {
        return productoRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Producto> obtenerTodosLosProductos() {
        System.out.println("🔥 🔥 🔥 PRODUCTO SERVICE EJECUTADO 🔥 🔥 🔥");
        
        try {
            List<Producto> productos = productoRepository.findAll();
            System.out.println("🎉 Productos en BD: " + productos.size());
            return productos;
        } catch (Exception e) {
            System.out.println("💥 Error en servicio: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<Producto> buscarProductosPorNombre(String nombre) {
        return productoRepository.findByNombreContainingIgnoreCase(nombre);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Producto> buscarProductosPorDescripcion(String descripcion) {
        // Necesitarías agregar este método en el repository
        return productoRepository.findByDescripcionContainingIgnoreCase(descripcion);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Producto> buscarProductosPorRangoPrecio(Double precioMin, Double precioMax) {
        return productoRepository.findByPrecioBetween(precioMin, precioMax);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Producto> buscarProductosPorTexto(String texto) {
        // Búsqueda en nombre y descripción
        return productoRepository.findByNombreContainingIgnoreCaseOrDescripcionContainingIgnoreCase(texto, texto);
    }

    @Override
    @Transactional
    public Producto actualizarProducto(Integer id, Producto producto) {
        Optional<Producto> productoExistente = productoRepository.findById(id);
        if (productoExistente.isPresent()) {
            Producto productoActual = productoExistente.get();
            productoActual.setNombre(producto.getNombre());
            productoActual.setDescripcion(producto.getDescripcion());
            productoActual.setPrecio(producto.getPrecio());
            productoActual.setImagen(producto.getImagen());
            productoActual.setCategoria(producto.getCategoria());
            return productoRepository.save(productoActual);
        }
        return null; // O podrías lanzar una excepción
    }

    @Override
    @Transactional
    public void eliminarProducto(Integer id) {
        productoRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existeProductoPorId(Integer id) {
        return productoRepository.existsById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existeProductoPorNombre(String nombre) {
        return productoRepository.existsByNombre(nombre);
    }

    @Override
    @Transactional(readOnly = true)
    public long contarTotalProductos() {
        return productoRepository.count();
    }

	@Override
	public Optional<Producto> buscarPorNombreYCategoria(String nombre, String categoria) {
		// TODO Auto-generated method stub
	    return productoRepository.findByNombreAndCategoria(nombre, categoria);

	}

	@Override
	public Producto actualizarProducto(Producto producto) {
	    // Verificar que el producto existe
	    if (!productoRepository.existsById(producto.getId())) {
	        throw new RuntimeException("Producto no encontrado con ID: " + producto.getId());
	    }
	    return productoRepository.save(producto);
	}
}