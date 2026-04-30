import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';
import { Categoria } from './entities/categoria.entity';
import { ProductosModule } from '../productos/productos.module';

@Module({
  imports: [TypeOrmModule.forFeature([Categoria]), forwardRef(() => ProductosModule)],
  controllers: [CategoriasController],
  providers: [CategoriasService],
  exports: [CategoriasService],
})
export class CategoriasModule {}
