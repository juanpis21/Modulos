import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarritosController } from './carritos.controller';
import { CarritoProductosController } from './carrito-productos.controller';
import { CarritoService } from './carrito.service';
import { Carrito } from './entities/carrito.entity';
import { CarritoProducto } from './entities/carrito-producto.entity';
import { UsersModule } from '../users/users.module';
import { ProductosModule } from '../productos/productos.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Carrito, CarritoProducto]),
    UsersModule,
    ProductosModule,
    AuthModule
  ],
  controllers: [CarritosController, CarritoProductosController],
  providers: [CarritoService],
  exports: [CarritoService]
})
export class CarritoModule {}
