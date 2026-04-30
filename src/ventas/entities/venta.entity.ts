import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { DetalleVenta } from './detalle-venta.entity';

@Entity('ventas')
export class Venta {
  @ApiProperty({ description: 'ID único de la venta', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Subtotal de la venta (sin impuestos/descuentos aplicados)', example: 100.50 })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @ApiProperty({ description: 'Total final a pagar', example: 100.50 })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @ApiProperty({ description: 'ID del usuario comprador' })
  @Column({ name: 'usuarioId' })
  usuarioId: number;

  @ApiProperty({ description: 'Usuario que realizó la compra', type: () => User })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'usuarioId' })
  usuario: User;

  @ApiProperty({ description: 'Detalles de los productos vendidos', type: () => [DetalleVenta] })
  @OneToMany(() => DetalleVenta, detalle => detalle.venta, { cascade: true })
  detalles: DetalleVenta[];

  // Nota: Dejamos el campo 'pago' para el futuro cuando implementemos el módulo de Pagos.

  @ApiProperty({ description: 'Fecha en que se registró la venta' })
  @CreateDateColumn()
  fecha: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
