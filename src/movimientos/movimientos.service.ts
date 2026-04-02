import { Injectable, NotFoundException, ConflictException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovimientoInventario } from './entities/movimiento-inventario.entity';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { UpdateMovimientoDto } from './dto/update-movimiento.dto';
import { ProductosService } from '../productos/productos.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class MovimientosService {
  constructor(
    @InjectRepository(MovimientoInventario)
    private movimientosRepository: Repository<MovimientoInventario>,
    @Inject(forwardRef(() => ProductosService))
    private productosService: ProductosService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  async create(createMovimientoDto: CreateMovimientoDto): Promise<MovimientoInventario> {
    // Obtener el producto
    const producto = await this.productosService.findOne(createMovimientoDto.productoId);
    
    // Obtener el usuario
    await this.usersService.findOne(createMovimientoDto.usuarioId);
    
    // Calcular stocks
    const stockAnterior = producto.stockActual;
    let stockNuevo = stockAnterior;

    if (createMovimientoDto.tipoMovimiento === 'ENTRADA') {
      stockNuevo = stockAnterior + createMovimientoDto.cantidad;
    } else if (createMovimientoDto.tipoMovimiento === 'SALIDA') {
      stockNuevo = stockAnterior - createMovimientoDto.cantidad;
      if (stockNuevo < 0) {
        throw new ConflictException('Stock insuficiente para esta salida');
      }
    } else if (createMovimientoDto.tipoMovimiento === 'AJUSTE') {
      stockNuevo = createMovimientoDto.cantidad;
    }

    // Crear el movimiento
    const movimiento = this.movimientosRepository.create({
      productoId: createMovimientoDto.productoId,
      tipoMovimiento: createMovimientoDto.tipoMovimiento,
      cantidad: createMovimientoDto.cantidad,
      stockAnterior,
      stockNuevo,
      motivo: createMovimientoDto.motivo,
      documentoReferencia: createMovimientoDto.documentoReferencia,
      usuarioId: createMovimientoDto.usuarioId,
      notas: createMovimientoDto.notas
    });

    const savedMovimiento = await this.movimientosRepository.save(movimiento);

    // Actualizar el stock del producto
    producto.stockActual = stockNuevo;
    await this.productosService.update(producto.id, { stockActual: stockNuevo });

    return savedMovimiento;
  }

  async findAll(): Promise<MovimientoInventario[]> {
    return this.movimientosRepository.find({ 
      relations: ['usuario'],
      select: ['id', 'tipoMovimiento', 'cantidad', 'stockAnterior', 'stockNuevo', 'motivo', 'documentoReferencia', 'fechaMovimiento', 'notas', 'productoId', 'usuarioId', 'usuario'],
      order: { fechaMovimiento: 'DESC' }
    });
  }

  async findOne(id: number): Promise<MovimientoInventario> {
    const movimiento = await this.movimientosRepository.findOne({
      where: { id },
      relations: ['usuario']
    });

    if (!movimiento) {
      throw new NotFoundException(`Movimiento with ID ${id} not found`);
    }

    return movimiento;
  }

  async update(id: number, updateMovimientoDto: UpdateMovimientoDto): Promise<MovimientoInventario> {
    const movimiento = await this.findOne(id);
    Object.assign(movimiento, updateMovimientoDto);
    return this.movimientosRepository.save(movimiento);
  }

  async remove(id: number): Promise<void> {
    const movimiento = await this.findOne(id);
    await this.movimientosRepository.remove(movimiento);
  }

  async findByProducto(productoId: number): Promise<MovimientoInventario[]> {
    return this.movimientosRepository.find({
      where: { productoId: productoId },
      relations: ['usuario'],
      order: { fechaMovimiento: 'DESC' }
    });
  }
}
