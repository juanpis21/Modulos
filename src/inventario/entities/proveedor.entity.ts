import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { MovimientoInventario } from './movimiento-inventario.entity';

@Entity('proveedores')
export class Proveedor {
  @ApiProperty({ 
    description: 'ID único del proveedor', 
    example: 1 
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ 
    description: 'Nombre del proveedor', 
    example: 'Laboratorios Bayer S.A.' 
  })
  @Column({ length: 200 })
  nombre: string;

  @ApiProperty({ 
    description: 'RUT o identificación fiscal del proveedor', 
    example: '76.123.456-7' 
  })
  @Column({ length: 20 })
  rut: string;

  @ApiProperty({ 
    description: 'Nombre de contacto', 
    example: 'Juan Pérez' 
  })
  @Column({ length: 100, nullable: true })
  contacto?: string;

  @ApiProperty({ 
    description: 'Teléfono del proveedor', 
    example: '+56 2 23456789' 
  })
  @Column({ length: 20, nullable: true })
  telefono?: string;

  @ApiProperty({ 
    description: 'Email del proveedor', 
    example: 'contacto@bayer.cl' 
  })
  @Column({ length: 100, nullable: true })
  email?: string;

  @ApiProperty({ 
    description: 'Dirección del proveedor', 
    example: 'Av. Principal #1234, Santiago' 
  })
  @Column({ type: 'text', nullable: true })
  direccion?: string;

  @ApiProperty({ 
    description: 'Ciudad del proveedor', 
    example: 'Santiago' 
  })
  @Column({ length: 100, nullable: true })
  ciudad?: string;

  @ApiProperty({ 
    description: 'País del proveedor', 
    example: 'Chile' 
  })
  @Column({ length: 50, nullable: true })
  pais?: string;

  @ApiProperty({ 
    description: 'Condiciones de pago', 
    example: '30 días' 
  })
  @Column({ length: 50, nullable: true })
  condicionesPago?: string;

  @ApiProperty({ 
    description: 'Tiempo de entrega en días', 
    example: 5 
  })
  @Column({ type: 'int', nullable: true })
  tiempoEntregaDias?: number;

  @ApiProperty({ 
    description: 'Notas adicionales del proveedor', 
    example: 'Proveedor principal de antiparasitarios',
    required: false
  })
  @Column({ type: 'text', nullable: true })
  notas?: string;

  @ApiProperty({ 
    description: 'Indica si el proveedor está activo', 
    example: true 
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ 
    description: 'Movimientos de inventario con este proveedor', 
    type: () => [MovimientoInventario] 
  })
  @OneToMany(() => MovimientoInventario, movimiento => movimiento.producto)
  movimientos: MovimientoInventario[];

  @ApiProperty({ description: 'Fecha de creación del registro', example: '2026-03-20T10:30:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización', example: '2026-03-20T10:30:00.000Z' })
  @UpdateDateColumn()
  updatedAt: Date;
}
