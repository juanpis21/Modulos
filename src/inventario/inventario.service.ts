import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, Between } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { Categoria } from './entities/categoria.entity';
import { MovimientoInventario } from './entities/movimiento-inventario.entity';
import { Proveedor } from './entities/proveedor.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { UpdateMovimientoDto } from './dto/update-movimiento.dto';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';

@Injectable()
export class InventarioService {
  constructor(
    @InjectRepository(Producto)
    private productosRepository: Repository<Producto>,
    @InjectRepository(Categoria)
    private categoriasRepository: Repository<Categoria>,
    @InjectRepository(MovimientoInventario)
    private movimientosRepository: Repository<MovimientoInventario>,
    @InjectRepository(Proveedor)
    private proveedoresRepository: Repository<Proveedor>,
  ) {}

  // ============ PRODUCTOS ============
  async createProducto(createProductoDto: CreateProductoDto): Promise<Producto> {
    // Verificar si ya existe un producto con el mismo código de barras
    if (createProductoDto.codigoBarras) {
      const existingProducto = await this.productosRepository.findOne({
        where: { codigoBarras: createProductoDto.codigoBarras },
      });
      if (existingProducto) {
        throw new ConflictException('Producto with this codigoBarras already exists');
      }
    }

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

  async findAllProductos(): Promise<Producto[]> {
    return this.productosRepository.find({ 
      relations: ['categoria', 'veterinaria'],
      select: ['id', 'nombre', 'descripcion', 'codigoBarras', 'stockActual', 'stockMinimo', 'stockMaximo', 'precioCompra', 'precioVenta', 'fechaVencimiento', 'unidadMedida', 'lote', 'ubicacion', 'isActive', 'createdAt', 'updatedAt', 'categoria', 'veterinaria']
    });
  }

  async findProductoById(id: number): Promise<Producto> {
    const producto = await this.productosRepository.findOne({
      where: { id },
      relations: ['categoria', 'veterinaria']
    });

    if (!producto) {
      throw new NotFoundException(`Producto with ID ${id} not found`);
    }

    return producto;
  }

  async updateProducto(id: number, updateProductoDto: UpdateProductoDto): Promise<Producto> {
    const producto = await this.findProductoById(id);

    // Verificar si el código de barras ya existe (si se está actualizando)
    if (updateProductoDto.codigoBarras && updateProductoDto.codigoBarras !== producto.codigoBarras) {
      const existingProducto = await this.productosRepository.findOne({
        where: { codigoBarras: updateProductoDto.codigoBarras },
      });
      if (existingProducto) {
        throw new ConflictException('Producto with this codigoBarras already exists');
      }
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

  async removeProducto(id: number): Promise<void> {
    const producto = await this.findProductoById(id);
    await this.productosRepository.remove(producto);
  }

  // ============ CATEGORÍAS ============
  async createCategoria(createCategoriaDto: CreateCategoriaDto): Promise<Categoria> {
    // Verificar si ya existe una categoría con el mismo código
    const existingCategoria = await this.categoriasRepository.findOne({
      where: { codigo: createCategoriaDto.codigo },
    });
    if (existingCategoria) {
      throw new ConflictException('Categoria with this codigo already exists');
    }

    const categoria = this.categoriasRepository.create(createCategoriaDto);
    return this.categoriasRepository.save(categoria);
  }

  async findAllCategorias(): Promise<Categoria[]> {
    return this.categoriasRepository.find({ 
      relations: ['productos'],
      select: ['id', 'nombre', 'descripcion', 'codigo', 'color', 'isActive', 'createdAt', 'updatedAt', 'productos']
    });
  }

  async findCategoriaById(id: number): Promise<Categoria> {
    const categoria = await this.categoriasRepository.findOne({
      where: { id },
      relations: ['productos']
    });

    if (!categoria) {
      throw new NotFoundException(`Categoria with ID ${id} not found`);
    }

    return categoria;
  }

  async updateCategoria(id: number, updateCategoriaDto: UpdateCategoriaDto): Promise<Categoria> {
    const categoria = await this.findCategoriaById(id);

    // Verificar si el código ya existe (si se está actualizando)
    if (updateCategoriaDto.codigo && updateCategoriaDto.codigo !== categoria.codigo) {
      const existingCategoria = await this.categoriasRepository.findOne({
        where: { codigo: updateCategoriaDto.codigo },
      });
      if (existingCategoria) {
        throw new ConflictException('Categoria with this codigo already exists');
      }
    }

    Object.assign(categoria, updateCategoriaDto);
    return this.categoriasRepository.save(categoria);
  }

  async removeCategoria(id: number): Promise<void> {
    const categoria = await this.findCategoriaById(id);
    await this.categoriasRepository.remove(categoria);
  }

  // ============ MOVIMIENTOS ============
  async createMovimiento(createMovimientoDto: CreateMovimientoDto): Promise<MovimientoInventario> {
    // Obtener el producto
    const producto = await this.findProductoById(createMovimientoDto.productoId);
    
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
      ...createMovimientoDto,
      stockAnterior,
      stockNuevo,
      producto
    });

    const savedMovimiento = await this.movimientosRepository.save(movimiento);

    // Actualizar el stock del producto
    producto.stockActual = stockNuevo;
    await this.productosRepository.save(producto);

    return savedMovimiento;
  }

  async findAllMovimientos(): Promise<MovimientoInventario[]> {
    return this.movimientosRepository.find({ 
      relations: ['producto', 'usuario'],
      select: ['id', 'tipoMovimiento', 'cantidad', 'stockAnterior', 'stockNuevo', 'motivo', 'documentoReferencia', 'fechaMovimiento', 'notas', 'producto', 'usuario'],
      order: { fechaMovimiento: 'DESC' }
    });
  }

  async findMovimientoById(id: number): Promise<MovimientoInventario> {
    const movimiento = await this.movimientosRepository.findOne({
      where: { id },
      relations: ['producto', 'usuario']
    });

    if (!movimiento) {
      throw new NotFoundException(`Movimiento with ID ${id} not found`);
    }

    return movimiento;
  }

  async updateMovimiento(id: number, updateMovimientoDto: UpdateMovimientoDto): Promise<MovimientoInventario> {
    const movimiento = await this.findMovimientoById(id);
    Object.assign(movimiento, updateMovimientoDto);
    return this.movimientosRepository.save(movimiento);
  }

  async removeMovimiento(id: number): Promise<void> {
    const movimiento = await this.findMovimientoById(id);
    await this.movimientosRepository.remove(movimiento);
  }

  // ============ PROVEEDORES ============
  async createProveedor(createProveedorDto: CreateProveedorDto): Promise<Proveedor> {
    // Verificar si ya existe un proveedor con el mismo RUT
    const existingProveedor = await this.proveedoresRepository.findOne({
      where: { rut: createProveedorDto.rut },
    });
    if (existingProveedor) {
      throw new ConflictException('Proveedor with this RUT already exists');
    }

    const proveedor = this.proveedoresRepository.create(createProveedorDto);
    return this.proveedoresRepository.save(proveedor);
  }

  async findAllProveedores(): Promise<Proveedor[]> {
    return this.proveedoresRepository.find({ 
      select: ['id', 'nombre', 'rut', 'contacto', 'telefono', 'email', 'direccion', 'ciudad', 'pais', 'condicionesPago', 'tiempoEntregaDias', 'notas', 'isActive', 'createdAt', 'updatedAt']
    });
  }

  async findProveedorById(id: number): Promise<Proveedor> {
    const proveedor = await this.proveedoresRepository.findOne({ where: { id } });

    if (!proveedor) {
      throw new NotFoundException(`Proveedor with ID ${id} not found`);
    }

    return proveedor;
  }

  async updateProveedor(id: number, updateProveedorDto: UpdateProveedorDto): Promise<Proveedor> {
    const proveedor = await this.findProveedorById(id);

    // Verificar si el RUT ya existe (si se está actualizando)
    if (updateProveedorDto.rut && updateProveedorDto.rut !== proveedor.rut) {
      const existingProveedor = await this.proveedoresRepository.findOne({
        where: { rut: updateProveedorDto.rut },
      });
      if (existingProveedor) {
        throw new ConflictException('Proveedor with this RUT already exists');
      }
    }

    Object.assign(proveedor, updateProveedorDto);
    return this.proveedoresRepository.save(proveedor);
  }

  async removeProveedor(id: number): Promise<void> {
    const proveedor = await this.findProveedorById(id);
    await this.proveedoresRepository.remove(proveedor);
  }

  // ============ MÉTODOS ESPECIALES ============
  async getProductosBajoStock(): Promise<Producto[]> {
    return this.productosRepository.find({
      where: { isActive: true },
      relations: ['categoria', 'veterinaria'],
      select: ['id', 'nombre', 'stockActual', 'stockMinimo', 'categoria', 'veterinaria']
    }).then(productos => productos.filter(p => p.stockActual <= p.stockMinimo));
  }

  async getProductosPorVencer(dias: number = 30): Promise<Producto[]> {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() + dias);
    
    return this.productosRepository.find({
      where: { 
        isActive: true,
        fechaVencimiento: LessThan(fechaLimite)
      },
      relations: ['categoria', 'veterinaria'],
      select: ['id', 'nombre', 'fechaVencimiento', 'categoria', 'veterinaria']
    });
  }

  async getMovimientosPorProducto(productoId: number): Promise<MovimientoInventario[]> {
    return this.movimientosRepository.find({
      where: { producto: { id: productoId } },
      relations: ['producto', 'usuario'],
      order: { fechaMovimiento: 'DESC' }
    });
  }

  async getReporteStockPorCategoria(): Promise<any[]> {
    return this.productosRepository
      .createQueryBuilder('producto')
      .leftJoin('producto.categoria', 'categoria')
      .select('categoria.nombre', 'categoria')
      .addSelect('COUNT(producto.id)', 'totalProductos')
      .addSelect('SUM(producto.stockActual)', 'stockTotal')
      .addSelect('SUM(producto.precioCompra * producto.stockActual)', 'valorInventario')
      .where('producto.isActive = :isActive', { isActive: true })
      .groupBy('categoria.id')
      .addGroupBy('categoria.nombre')
      .orderBy('categoria.nombre', 'ASC')
      .getRawMany();
  }
}
