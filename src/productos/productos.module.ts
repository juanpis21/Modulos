import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { Producto } from './entities/producto.entity';
import { CategoriasModule } from '../categorias/categorias.module';
import { VeterinariasModule } from '../veterinarias/veterinarias.module';

@Module({
  imports: [TypeOrmModule.forFeature([Producto]), forwardRef(() => CategoriasModule), forwardRef(() => VeterinariasModule)],
  controllers: [ProductosController],
  providers: [ProductosService],
  exports: [ProductosService],
})
export class ProductosModule {}
