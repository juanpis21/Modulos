package com.clinicpet.demo.dto;

import java.util.Date;
import java.util.List;

public class VentaDTO {
    private Integer id;
    private Date fecha;
    private Double subtotal;
    private Double total;
    private String metodoPago;
    private String estadoPago;
    private String referencia;
    private List<DetalleVentaDTO> detalles;
    
    // Constructor vacío
    public VentaDTO() {
    }
    
    // Constructor completo
    public VentaDTO(Integer id, Date fecha, Double subtotal, Double total, String metodoPago, 
                    String estadoPago, String referencia, List<DetalleVentaDTO> detalles) {
        this.id = id;
        this.fecha = fecha;
        this.subtotal = subtotal;
        this.total = total;
        this.metodoPago = metodoPago;
        this.estadoPago = estadoPago;
        this.referencia = referencia;
        this.detalles = detalles;
    }
    
    // Getters y Setters
    public Integer getId() {
        return id;
    }
    
    public void setId(Integer id) {
        this.id = id;
    }
    
    public Date getFecha() {
        return fecha;
    }
    
    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }
    
    public Double getSubtotal() {
        return subtotal;
    }
    
    public void setSubtotal(Double subtotal) {
        this.subtotal = subtotal;
    }
    
    public Double getTotal() {
        return total;
    }
    
    public void setTotal(Double total) {
        this.total = total;
    }
    
    public String getMetodoPago() {
        return metodoPago;
    }
    
    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }
    
    public String getEstadoPago() {
        return estadoPago;
    }
    
    public void setEstadoPago(String estadoPago) {
        this.estadoPago = estadoPago;
    }
    
    public String getReferencia() {
        return referencia;
    }
    
    public void setReferencia(String referencia) {
        this.referencia = referencia;
    }
    
    public List<DetalleVentaDTO> getDetalles() {
        return detalles;
    }
    
    public void setDetalles(List<DetalleVentaDTO> detalles) {
        this.detalles = detalles;
    }
    
    // Clase interna para DetalleVentaDTO
    public static class DetalleVentaDTO {
        private Integer productoId;
        private String productoNombre;
        private Integer cantidad;
        private Double precioUnitario;
        private Double subtotal;
        
        public DetalleVentaDTO() {
        }
        
        public DetalleVentaDTO(Integer productoId, String productoNombre, Integer cantidad, 
                              Double precioUnitario, Double subtotal) {
            this.productoId = productoId;
            this.productoNombre = productoNombre;
            this.cantidad = cantidad;
            this.precioUnitario = precioUnitario;
            this.subtotal = subtotal;
        }
        
        // Getters y Setters
        public Integer getProductoId() {
            return productoId;
        }
        
        public void setProductoId(Integer productoId) {
            this.productoId = productoId;
        }
        
        public String getProductoNombre() {
            return productoNombre;
        }
        
        public void setProductoNombre(String productoNombre) {
            this.productoNombre = productoNombre;
        }
        
        public Integer getCantidad() {
            return cantidad;
        }
        
        public void setCantidad(Integer cantidad) {
            this.cantidad = cantidad;
        }
        
        public Double getPrecioUnitario() {
            return precioUnitario;
        }
        
        public void setPrecioUnitario(Double precioUnitario) {
            this.precioUnitario = precioUnitario;
        }
        
        public Double getSubtotal() {
            return subtotal;
        }
        
        public void setSubtotal(Double subtotal) {
            this.subtotal = subtotal;
        }
    }
}
