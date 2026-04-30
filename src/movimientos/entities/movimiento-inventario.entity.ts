import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('movimientos_inventario')
export class MovimientoInventario {
  @ApiProperty({ 
    description: 'ID único del movimiento', 
    example: 1 
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ 
    description: 'ID del producto', 
    example: 1 
  })
  @Column({ name: 'productoId' })
  productoId: number;

  @ApiProperty({ 
    description: 'Tipo de movimiento', 
    example: 'ENTRADA',
    enum: ['ENTRADA', 'SALIDA', 'AJUSTE', 'DEVOLUCION']
  })
  @Column({ 
    length: 20,
    enum: ['ENTRADA', 'SALIDA', 'AJUSTE', 'DEVOLUCION']
  })
  tipoMovimiento: string;

  @ApiProperty({ 
    description: 'Cantidad movida', 
    example: 10 
  })
  @Column({ type: 'int' })
  cantidad: number;

  @ApiProperty({ 
    description: 'Stock antes del movimiento', 
    example: 25 
  })
  @Column({ type: 'int' })
  stockAnterior: number;

  @ApiProperty({ 
    description: 'Stock después del movimiento', 
    example: 35 
  })
  @Column({ type: 'int' })
  stockNuevo: number;

  @ApiProperty({ 
    description: 'Motivo del movimiento', 
    example: 'Compra a proveedor' 
  })
  @Column({ type: 'text' })
  motivo: string;

  @ApiProperty({ 
    description: 'Número de documento o referencia', 
    example: 'FACT-001234',
    required: false
  })
  @Column({ length: 50, nullable: true })
  documentoReferencia?: string;

  @ApiProperty({ 
    description: 'ID del usuario que realiza el movimiento', 
    example: 1 
  })
  @Column({ name: 'usuarioId' })
  usuarioId: number;

  @ApiProperty({ 
    description: 'Usuario que realizó el movimiento', 
    type: () => User 
  })
  @ManyToOne(() => User, user => user.id)
  usuario: User;

  @ApiProperty({ 
    description: 'Notas adicionales del movimiento', 
    example: 'Medicamento recibido con fecha de vencimiento 2024-12-31',
    required: false
  })
  @Column({ type: 'text', nullable: true })
  notas?: string;

  @ApiProperty({ 
    description: 'Fecha y hora del movimiento', 
    example: '2026-03-20T10:30:00.000Z' 
  })
  @CreateDateColumn()
  fechaMovimiento: Date;
}
