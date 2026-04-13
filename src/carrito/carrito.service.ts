import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carrito } from './entities/carrito.entity';
import { CarritoProducto } from './entities/carrito-producto.entity';
import { CreateCarritoDto } from './dto/create-carrito.dto';
import { UpdateCarritoDto } from './dto/update-carrito.dto';
import { AddProductoDto } from './dto/add-producto.dto';
import { EstadoCarrito } from './entities/carrito.entity';
import { ProductosService } from '../productos/productos.service';

@Injectable()
export class CarritoService {
  constructor(
    @InjectRepository(Carrito)
    private carritoRepository: Repository<Carrito>,
    @InjectRepository(CarritoProducto)
    private carritoProductoRepository: Repository<CarritoProducto>,
    private readonly productosService: ProductosService,
  ) {}

  // ============================================
  // CRUD BÁSICO DEL CARRITO
  // ============================================

  async create(usuarioId: number, createCarritoDto: CreateCarritoDto): Promise<Carrito> {
    const carrito = this.carritoRepository.create({
      ...createCarritoDto,
      usuarioId,
      estado: EstadoCarrito.ACTIVO
    });

    return this.carritoRepository.save(carrito);
  }

  async findAll(): Promise<Carrito[]> {
    return this.carritoRepository.find({
      relations: ['productos', 'productos.producto']
    });
  }

  async findOne(id: number): Promise<Carrito> {
    const carrito = await this.carritoRepository.findOne({
      where: { id },
      relations: ['productos', 'productos.producto']
    });

    if (!carrito) {
      throw new NotFoundException(`Carrito con ID ${id} no encontrado`);
    }

    return carrito;
  }

  async findByUsuario(usuarioId: number): Promise<Carrito[]> {
    return this.carritoRepository.find({
      where: { usuarioId },
      relations: ['productos', 'productos.producto'],
      order: { createdAt: 'DESC' }
    });
  }

  async findCarritoActivo(usuarioId: number): Promise<Carrito> {
    const carrito = await this.carritoRepository.findOne({
      where: { usuarioId, estado: EstadoCarrito.ACTIVO },
      relations: ['productos', 'productos.producto']
    });

    if (!carrito) {
      throw new NotFoundException('No se encontró un carrito activo para este usuario');
    }

    return carrito;
  }

  async update(id: number, updateCarritoDto: UpdateCarritoDto): Promise<Carrito> {
    const carrito = await this.findOne(id);

    Object.assign(carrito, updateCarritoDto);
    return this.carritoRepository.save(carrito);
  }

  async remove(id: number): Promise<void> {
    const carrito = await this.findOne(id);
    // Primero eliminar los productos del carrito, luego el carrito
    await this.carritoProductoRepository.delete({ carritoId: carrito.id });
    await this.carritoRepository.remove(carrito);
  }

  // ============================================
  // GESTIÓN DE PRODUCTOS EN EL CARRITO
  // ============================================

  async getProductosCarrito(carritoId: number): Promise<CarritoProducto[]> {
    return await this.carritoProductoRepository.find({
      where: { carritoId },
      relations: ['producto']
    });
  }

  async addProducto(usuarioId: number, addProductoDto: AddProductoDto): Promise<Carrito> {
    // Obtener o crear carrito activo
    let carrito: Carrito;
    try {
      carrito = await this.findCarritoActivo(usuarioId);
    } catch (error) {
      // No hay carrito activo, crear uno nuevo
      carrito = await this.create(usuarioId, {});
      // Recargar con relaciones para que productos sea un array vacío
      carrito = await this.findCarritoActivo(usuarioId);
    }

    // 1. Verificar que el producto existe
    const producto = await this.productosService.findOne(addProductoDto.productoId);

    // 2. Buscar si el producto ya está en el carrito
    const productoExistente = await this.carritoProductoRepository.findOne({
      where: { carritoId: carrito.id, productoId: addProductoDto.productoId }
    });

    // 3. Verificar stock antes de agregar o actualizar
    const cantidadActualEnCarrito = productoExistente ? productoExistente.cantidad : 0;
    const nuevaCantidad = cantidadActualEnCarrito + addProductoDto.cantidad;
    
    if (producto.stockActual < nuevaCantidad) {
      throw new BadRequestException(
        `No hay suficiente stock para el producto "${producto.nombre}". ` +
        `Stock disponible: ${producto.stockActual}, Cantidad solicitada: ${nuevaCantidad} ` +
        `(Ya tienes ${cantidadActualEnCarrito} en el carrito)`
      );
    }

    if (productoExistente) {
      // Actualizar cantidad sumando la nueva
      productoExistente.cantidad += addProductoDto.cantidad;
      await this.carritoProductoRepository.save(productoExistente);
    } else {
      // Agregar nuevo producto al carrito
      const carritoProducto = this.carritoProductoRepository.create({
        carritoId: carrito.id,
        productoId: addProductoDto.productoId,
        cantidad: addProductoDto.cantidad,
        precioUnitario: producto.precioVenta
      });
      await this.carritoProductoRepository.save(carritoProducto);
    }

    // Retornar carrito actualizado con relaciones
    return this.findCarritoActivo(usuarioId);
  }

  async removeProducto(usuarioId: number, productoId: number): Promise<Carrito> {
    const carrito = await this.findCarritoActivo(usuarioId);

    // Usar delete directo en la BD en lugar de remove con entidades cargadas
    const result = await this.carritoProductoRepository.delete({
      carritoId: carrito.id,
      productoId: productoId
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Producto con ID ${productoId} no encontrado en el carrito`);
    }

    return this.findCarritoActivo(usuarioId);
  }

  async updateCantidad(usuarioId: number, productoId: number, cantidad: number): Promise<Carrito> {
    console.log(`[DEBUG-SERVICE] updateCantidad llamado: usuario=${usuarioId}, producto=${productoId}, cantidad=${cantidad}`);
    if (!cantidad || cantidad < 1) {
      throw new BadRequestException('La cantidad debe ser al menos 1');
    }

    const carrito = await this.findCarritoActivo(usuarioId);

    // Buscar el producto en el carrito con query directa
    const carritoProducto = await this.carritoProductoRepository.findOne({
      where: { carritoId: carrito.id, productoId: productoId }
    });

    // 3. Verificar stock antes de actualizar
    const producto = await this.productosService.findOne(productoId);
    if (producto.stockActual < cantidad) {
      throw new BadRequestException(
        `No hay suficiente stock para el producto "${producto.nombre}". ` +
        `Stock disponible: ${producto.stockActual}, Cantidad solicitada: ${cantidad}`
      );
    }

    carritoProducto.cantidad = cantidad;
    await this.carritoProductoRepository.save(carritoProducto);

    return this.findCarritoActivo(usuarioId);
  }

  // ============================================
  // ACCIONES DEL CARRITO
  // ============================================

  async vaciarCarrito(usuarioId: number): Promise<Carrito> {
    const carrito = await this.findCarritoActivo(usuarioId);

    await this.carritoProductoRepository.delete({ carritoId: carrito.id });
    return this.findCarritoActivo(usuarioId);
  }

  async getResumenCarrito(usuarioId: number): Promise<any> {
    const carrito = await this.findCarritoActivo(usuarioId);

    let totalItems = 0;
    let totalPrecio = 0;

    carrito.productos.forEach(item => {
      const precio = Number(item.precioUnitario);
      totalItems += item.cantidad;
      totalPrecio += item.cantidad * precio;
    });

    return {
      carritoId: carrito.id,
      estado: carrito.estado,
      totalItems,
      totalPrecio: Math.round(totalPrecio * 100) / 100,
      productos: carrito.productos.map(item => {
        const precio = Number(item.precioUnitario);
        return {
          productoId: item.productoId,
          nombre: item.producto?.nombre || 'Producto no disponible',
          cantidad: item.cantidad,
          precioUnitario: precio,
          subtotal: Math.round(item.cantidad * precio * 100) / 100
        };
      })
    };
  }
}
