import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Producto } from '../productos/entities/producto.entity';
import { MovimientoInventario } from '../movimientos/entities/movimiento-inventario.entity';
import { ProductosService } from '../productos/productos.service';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Producto)
    private productosRepository: Repository<Producto>,
    @InjectRepository(MovimientoInventario)
    private movimientosRepository: Repository<MovimientoInventario>,
    private productosService: ProductosService,
  ) {}

  async getProductosBajoStock(): Promise<Producto[]> {
    return this.productosRepository.find({
      where: { isActive: true },
      relations: ['veterinaria'],
      select: ['id', 'nombre', 'stockActual', 'stockMinimo', 'categoriaId', 'veterinaria']
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
      relations: ['veterinaria'],
      select: ['id', 'nombre', 'fechaVencimiento', 'categoriaId', 'veterinaria']
    });
  }

  async getReporteStockPorCategoria(): Promise<any[]> {
    return this.productosRepository
      .createQueryBuilder('producto')
      .leftJoin('categorias', 'categoria', 'categoria.id = producto.categoriaId')
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

  async getReporteStockPorVeterinaria(): Promise<any[]> {
    return this.productosRepository
      .createQueryBuilder('producto')
      .leftJoin('veterinarias', 'veterinaria', 'veterinaria.id = producto.veterinariaId')
      .select('veterinaria.nombre', 'veterinaria')
      .addSelect('COUNT(producto.id)', 'totalProductos')
      .addSelect('SUM(producto.stockActual)', 'stockTotal')
      .addSelect('SUM(producto.precioCompra * producto.stockActual)', 'valorInventario')
      .where('producto.isActive = :isActive', { isActive: true })
      .groupBy('veterinaria.id')
      .addGroupBy('veterinaria.nombre')
      .orderBy('veterinaria.nombre', 'ASC')
      .getRawMany();
  }

  async getReporteValorTotalInventario(): Promise<any> {
    const result = await this.productosRepository
      .createQueryBuilder('producto')
      .select('COUNT(producto.id)', 'totalProductos')
      .addSelect('SUM(producto.stockActual)', 'stockTotal')
      .addSelect('SUM(producto.precioCompra * producto.stockActual)', 'valorInventario')
      .addSelect('SUM(producto.precioVenta * producto.stockActual)', 'valorVenta')
      .where('producto.isActive = :isActive', { isActive: true })
      .getRawOne();

    return result || {
      totalProductos: 0,
      stockTotal: 0,
      valorInventario: 0,
      valorVenta: 0
    };
  }

  async getAlertasStock(): Promise<any> {
    const productosBajoStock = await this.getProductosBajoStock();
    const productosPorVencer = await this.getProductosPorVencer(30);
    
    return {
      productosBajoStock: {
        total: productosBajoStock.length,
        productos: productosBajoStock
      },
      productosPorVencer: {
        total: productosPorVencer.length,
        productos: productosPorVencer
      },
      totalAlertas: productosBajoStock.length + productosPorVencer.length
    };
  }
}
