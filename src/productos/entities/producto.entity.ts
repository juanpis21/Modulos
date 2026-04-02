import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Veterinaria } from '../../veterinarias/entities/veterinaria.entity';

@Entity('productos')
export class Producto {
  @ApiProperty({ 
    description: 'ID único del producto', 
    example: 1 
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ 
    description: 'Nombre del producto', 
    example: 'Ivermectina 1% Solución Inyectable' 
  })
  @Column({ length: 200 })
  nombre: string;

  @ApiProperty({ 
    description: 'Descripción detallada del producto', 
    example: 'Antiparasitario interno para perros y gatos. Presentación de 50ml.' 
  })
  @Column({ type: 'text' })
  descripcion: string;

  @ApiProperty({ 
    description: 'Código de barras o SKU del producto', 
    example: 'IVER001-50ML',
    required: false
  })
  @Column({ length: 50, unique: true, nullable: true })
  codigoBarras?: string;

  @ApiProperty({ 
    description: 'Cantidad actual en stock', 
    example: 25 
  })
  @Column({ type: 'int', default: 0 })
  stockActual: number;

  @ApiProperty({ 
    description: 'Stock mínimo para alertas', 
    example: 10 
  })
  @Column({ type: 'int', default: 5 })
  stockMinimo: number;

  @ApiProperty({ 
    description: 'Stock máximo permitido', 
    example: 100 
  })
  @Column({ type: 'int', nullable: true })
  stockMaximo?: number;

  @ApiProperty({ 
    description: 'Precio de compra por unidad', 
    example: 15.50 
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precioCompra: number;

  @ApiProperty({ 
    description: 'Precio de venta por unidad', 
    example: 25.00 
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precioVenta: number;

  @ApiProperty({ 
    description: 'Fecha de vencimiento del producto', 
    example: '2024-12-31',
    required: false
  })
  @Column({ type: 'date', nullable: true })
  fechaVencimiento?: Date;

  @ApiProperty({ 
    description: 'Unidad de medida', 
    example: 'ml',
    enum: ['ml', 'mg', 'tabletas', 'capsulas', 'unidades', 'kg', 'g', 'l']
  })
  @Column({ 
    length: 20,
    enum: ['ml', 'mg', 'tabletas', 'capsulas', 'unidades', 'kg', 'g', 'l']
  })
  unidadMedida: string;

  @ApiProperty({ 
    description: 'Lote del producto', 
    example: 'LOT-2024-001',
    required: false
  })
  @Column({ length: 50, nullable: true })
  lote?: string;

  @ApiProperty({ 
    description: 'Ubicación física en el almacen', 
    example: 'Estantía A-3',
    required: false
  })
  @Column({ length: 100, nullable: true })
  ubicacion?: string;

  @ApiProperty({ 
    description: 'Indica si el producto está activo', 
    example: true 
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ 
    description: 'ID de la categoría del producto', 
    example: 1 
  })
  @Column({ name: 'categoriaId' })
  categoriaId: number;

  @ApiProperty({ 
    description: 'ID de la veterinaria', 
    example: 1 
  })
  @Column({ name: 'veterinariaId' })
  veterinariaId: number;

  @ApiProperty({ 
    description: 'Veterinaria donde se encuentra el producto', 
    type: () => Veterinaria 
  })
  @ManyToOne(() => Veterinaria, veterinaria => veterinaria.productos)
  veterinaria: Veterinaria;

  @ApiProperty({ description: 'Fecha de creación del registro', example: '2026-03-20T10:30:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización', example: '2026-03-20T10:30:00.000Z' })
  @UpdateDateColumn()
  updatedAt: Date;
}
