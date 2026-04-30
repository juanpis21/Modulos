import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Producto } from './producto.entity';

@Entity('categorias')
export class Categoria {
  @ApiProperty({ 
    description: 'ID único de la categoría', 
    example: 1 
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ 
    description: 'Nombre de la categoría', 
    example: 'Antiparasitarios' 
  })
  @Column({ length: 100 })
  nombre: string;

  @ApiProperty({ 
    description: 'Descripción de la categoría', 
    example: 'Medicamentos para control de parásitos internos y externos' 
  })
  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @ApiProperty({ 
    description: 'Código de la categoría', 
    example: 'ANTI-001' 
  })
  @Column({ length: 20, unique: true })
  codigo: string;

  @ApiProperty({ 
    description: 'Color para identificar la categoría', 
    example: '#FF6B6B',
    required: false
  })
  @Column({ length: 7, nullable: true })
  color?: string;

  @ApiProperty({ 
    description: 'Indica si la categoría está activa', 
    example: true 
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ 
    description: 'Productos de esta categoría', 
    type: () => [Producto] 
  })
  @OneToMany(() => Producto, producto => producto.categoria)
  productos: Producto[];

  @ApiProperty({ description: 'Fecha de creación del registro', example: '2026-03-20T10:30:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización', example: '2026-03-20T10:30:00.000Z' })
  @UpdateDateColumn()
  updatedAt: Date;
}
