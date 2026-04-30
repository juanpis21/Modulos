import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { Producto } from '../productos/entities/producto.entity';
import { MovimientoInventario } from '../movimientos/entities/movimiento-inventario.entity';
import { Categoria } from '../categorias/entities/categoria.entity';
import { Veterinaria } from '../veterinarias/entities/veterinaria.entity';
import { ProductosModule } from '../productos/productos.module';

@Module({
  imports: [TypeOrmModule.forFeature([Producto, MovimientoInventario, Categoria, Veterinaria]), forwardRef(() => ProductosModule)],
  controllers: [StockController],
  providers: [StockService],
  exports: [StockService],
})
export class StockModule {}
