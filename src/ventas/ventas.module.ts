import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { Venta } from './entities/venta.entity';
import { DetalleVenta } from './entities/detalle-venta.entity';
import { CarritoModule } from '../carrito/carrito.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Venta, DetalleVenta]),
    CarritoModule // Importamos para poder usar CarritoService
  ],
  controllers: [VentasController],
  providers: [VentasService],
  exports: [VentasService]
})
export class VentasModule {}
