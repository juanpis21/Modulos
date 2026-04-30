import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { Venta } from './venta.entity';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('detalle_venta')
export class DetalleVenta {
  @ApiProperty({ description: 'ID único del detalle', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Cantidad vendida del producto', example: 2 })
  @Column({ type: 'int' })
  cantidad: number;

  @ApiProperty({ description: 'Precio unitario congelado al momento de la venta', example: 25.00 })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precioUnitario: number;

  @ApiProperty({ description: 'ID de la venta a la que pertenece' })
  @Column({ name: 'ventaId' })
  ventaId: number;

  @ApiProperty({ description: 'Venta asociada', type: () => Venta })
  @ManyToOne(() => Venta, venta => venta.detalles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ventaId' })
  venta: Venta;

  @ApiProperty({ description: 'ID del producto vendido' })
  @Column({ name: 'productoId' })
  productoId: number;

  @ApiProperty({ description: 'Producto vendido', type: () => Producto })
  @ManyToOne(() => Producto)
  @JoinColumn({ name: 'productoId' })
  producto: Producto;
}
