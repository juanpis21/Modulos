import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CarritoProducto } from './carrito-producto.entity';

export enum EstadoCarrito {
  ACTIVO = 'ACTIVO',
  COMPRADO = 'COMPRADO',
  CANCELADO = 'CANCELADO'
}

@Entity('carrito')
export class Carrito {
  @ApiProperty({ 
    description: 'ID único del carrito', 
    example: 1 
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ 
    description: 'Estado del carrito', 
    example: 'ACTIVO',
    enum: EstadoCarrito
  })
  @Column({ 
    type: 'enum',
    enum: EstadoCarrito,
    default: EstadoCarrito.ACTIVO
  })
  estado: EstadoCarrito;

  @ApiProperty({ 
    description: 'ID del usuario dueño del carrito', 
    example: 1 
  })
  @Column({ name: 'usuarioId' })
  usuarioId: number;

  @ApiProperty({ 
    description: 'Usuario dueño del carrito', 
    type: () => User 
  })
  @ManyToOne(() => User)
  usuario: User;

  @ApiProperty({ 
    description: 'Productos en el carrito', 
    type: () => [CarritoProducto] 
  })
  @OneToMany(() => CarritoProducto, carritoProducto => carritoProducto.carrito, { cascade: true })
  productos: CarritoProducto[];

  @ApiProperty({ 
    description: 'Fecha de creación del carrito', 
    example: '2026-03-20T10:30:00.000Z' 
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ 
    description: 'Fecha de última actualización', 
    example: '2026-03-20T10:30:00.000Z' 
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
