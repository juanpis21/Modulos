import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { CategoriasService } from '../categorias/categorias.service';
import { VeterinariasService } from '../veterinarias/veterinarias.service';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private productosRepository: Repository<Producto>,
    private categoriasService: CategoriasService,
    private veterinariasService: VeterinariasService,
  ) {}

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    // Verificar si ya existe un producto con el mismo código de barras
    if (createProductoDto.codigoBarras) {
      const existingProducto = await this.productosRepository.findOne({
        where: { codigoBarras: createProductoDto.codigoBarras },
      });
      if (existingProducto) {
        throw new ConflictException('Producto with this codigoBarras already exists');
      }
    }

    // Verificar que la categoría existe
    await this.categoriasService.findOne(createProductoDto.categoriaId);
    
    // Verificar que la veterinaria existe
    await this.veterinariasService.findOne(createProductoDto.veterinariaId);

    // Convertir fechaVencimiento de string a Date si existe
    const productoData = {
      ...createProductoDto,
      fechaVencimiento: createProductoDto.fechaVencimiento 
        ? new Date(createProductoDto.fechaVencimiento) 
        : undefined
    };

    const producto = this.productosRepository.create(productoData);
    return this.productosRepository.save(producto);
  }

  async findAll(): Promise<Producto[]> {
    return this.productosRepository.find({ 
      relations: ['veterinaria'],
      select: ['id', 'nombre', 'descripcion', 'codigoBarras', 'stockActual', 'stockMinimo', 'stockMaximo', 'precioCompra', 'precioVenta', 'fechaVencimiento', 'unidadMedida', 'lote', 'ubicacion', 'isActive', 'createdAt', 'updatedAt', 'categoriaId', 'veterinariaId', 'veterinaria']
    });
  }

  async findOne(id: number): Promise<Producto> {
    const producto = await this.productosRepository.findOne({
      where: { id },
      relations: ['veterinaria']
    });

    if (!producto) {
      throw new NotFoundException(`Producto with ID ${id} not found`);
    }

    return producto;
  }

  async update(id: number, updateProductoDto: UpdateProductoDto): Promise<Producto> {
    const producto = await this.findOne(id);

    // Verificar si el código de barras ya existe (si se está actualizando)
    if (updateProductoDto.codigoBarras && updateProductoDto.codigoBarras !== producto.codigoBarras) {
      const existingProducto = await this.productosRepository.findOne({
        where: { codigoBarras: updateProductoDto.codigoBarras },
      });
      if (existingProducto) {
        throw new ConflictException('Producto with this codigoBarras already exists');
      }
    }

    // Verificar que la categoría existe si se está actualizando
    if (updateProductoDto.categoriaId) {
      await this.categoriasService.findOne(updateProductoDto.categoriaId);
    }

    // Verificar que la veterinaria existe si se está actualizando
    if (updateProductoDto.veterinariaId) {
      await this.veterinariasService.findOne(updateProductoDto.veterinariaId);
    }

    // Convertir fechaVencimiento de string a Date si existe
    const updateData = {
      ...updateProductoDto,
      fechaVencimiento: updateProductoDto.fechaVencimiento 
        ? new Date(updateProductoDto.fechaVencimiento) 
        : undefined
    };

    Object.assign(producto, updateData);
    return this.productosRepository.save(producto);
  }

  async remove(id: number): Promise<void> {
    const producto = await this.findOne(id);
    await this.productosRepository.remove(producto);
  }
}
