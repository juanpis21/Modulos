import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { DetalleVenta } from './entities/detalle-venta.entity';
import { CarritoService } from '../carrito/carrito.service';
import { EstadoCarrito } from '../carrito/entities/carrito.entity';
import { Producto } from '../productos/entities/producto.entity';
import { CheckoutDto } from './dto/checkout.dto';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private ventaRepository: Repository<Venta>,
    private readonly carritoService: CarritoService,
    private dataSource: DataSource
  ) {}

  async checkout(usuarioId: number, checkoutDto: CheckoutDto): Promise<Venta> {
    // 1. Obtener el carrito activo del usuario usando el CarritoService
    const carrito = await this.carritoService.findCarritoActivo(usuarioId);
    
    if (!carrito.productos || carrito.productos.length === 0) {
      throw new BadRequestException('El carrito está vacío. No se puede procesar la venta.');
    }

    // Calcular el total
    let subtotal = 0;
    carrito.productos.forEach(item => {
      subtotal += item.cantidad * Number(item.precioUnitario);
    });
    
    const total = subtotal; // Aquí podrías sumar impuestos o envíos en el futuro

    // Iniciar transacción de base de datos
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 2. Crear la entidad Venta
      const nuevaVenta = new Venta();
      nuevaVenta.usuarioId = usuarioId;
      nuevaVenta.subtotal = subtotal;
      nuevaVenta.total = total;
      
      const ventaGuardada = await queryRunner.manager.save(Venta, nuevaVenta);

      // 3. Crear los Detalles de Venta y Descontar Stock
      for (const item of carrito.productos) {
        // Verificar stock actual
        const producto = await queryRunner.manager.findOne(Producto, {
            where: { id: item.productoId },
            lock: { mode: 'pessimistic_write' } // Evitar race conditions en stock
        });

        if (!producto) {
            throw new NotFoundException(`Producto ${item.productoId} no encontrado`);
        }

        if (producto.stockActual < item.cantidad) {
            throw new BadRequestException(`Sin stock suficiente para el producto: ${producto.nombre}. Stock disponible: ${producto.stockActual}`);
        }

        // Crear detalle
        const detalle = new DetalleVenta();
        detalle.ventaId = ventaGuardada.id;
        detalle.productoId = item.productoId;
        detalle.cantidad = item.cantidad;
        detalle.precioUnitario = item.precioUnitario;
        
        await queryRunner.manager.save(DetalleVenta, detalle);

        // Descontar stock del producto
        producto.stockActual -= item.cantidad;
        await queryRunner.manager.save(Producto, producto);
      }

      // 4. Marcar el carrito como COMPRADO
      carrito.estado = EstadoCarrito.COMPRADO;
      await queryRunner.manager.save(carrito);

      // Confirmar todos los cambios
      await queryRunner.commitTransaction();

      // Devolver la venta con sus relaciones
      return this.findOne(ventaGuardada.id);
    } catch (error) {
      // Revertir todo si hay algún error
      await queryRunner.rollbackTransaction();
      
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
          throw error;
      }
      
      console.error('Error procesando checkout:', error);
      throw new InternalServerErrorException('Ocurrió un error al procesar el pago y la venta');
    } finally {
      // Liberar conexión
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Venta[]> {
    return this.ventaRepository.find({
      relations: ['usuario', 'detalles', 'detalles.producto'],
      order: { fecha: 'DESC' }
    });
  }

  async findByUsuario(usuarioId: number): Promise<Venta[]> {
    return this.ventaRepository.find({
      where: { usuarioId },
      relations: ['detalles', 'detalles.producto'],
      order: { fecha: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Venta> {
    const venta = await this.ventaRepository.findOne({
      where: { id },
      relations: ['usuario', 'detalles', 'detalles.producto']
    });

    if (!venta) {
      throw new NotFoundException(`Venta con ID ${id} no encontrada`);
    }

    return venta;
  }
}
