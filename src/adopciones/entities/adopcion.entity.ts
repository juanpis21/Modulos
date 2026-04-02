import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Pet } from '../../pets/entities/pet.entity';
import { User } from '../../users/entities/user.entity';
import { Veterinaria } from '../../veterinarias/entities/veterinaria.entity';

export enum EstadoAdopcion {
  PENDIENTE = 'PENDIENTE',
  APROBADA = 'APROBADA',
  RECHAZADA = 'RECHAZADA',
  COMPLETADA = 'COMPLETADA',
  CANCELADA = 'CANCELADA'
}

@Entity('adopciones')
export class Adopcion {
  @ApiProperty({ 
    description: 'ID único de la adopción', 
    example: 1 
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ 
    description: 'Mascota que será adoptada', 
    type: () => Pet 
  })
  @ManyToOne(() => Pet, pet => pet.adopciones)
  mascota: Pet;

  @ApiProperty({ 
    description: 'Usuario que desea adoptar', 
    type: () => User 
  })
  @ManyToOne(() => User, user => user.adopcionesRealizadas)
  adoptante: User;

  @ApiProperty({ 
    description: 'Veterinaria que gestiona la adopción', 
    type: () => Veterinaria 
  })
  @ManyToOne(() => Veterinaria, veterinaria => veterinaria.adopciones)
  veterinaria: Veterinaria;

  @ApiProperty({ 
    description: 'Fecha de solicitud de adopción', 
    example: '2026-03-20T10:30:00.000Z' 
  })
  @Column({ type: 'timestamp' })
  fechaSolicitud: Date;

  @ApiProperty({ 
    description: 'Fecha de aprobación de la adopción', 
    example: '2026-03-22T15:00:00.000Z',
    required: false
  })
  @Column({ type: 'timestamp', nullable: true })
  fechaAprobacion?: Date;

  @ApiProperty({ 
    description: 'Fecha de entrega de la mascota', 
    example: '2026-03-25T10:00:00.000Z',
    required: false
  })
  @Column({ type: 'timestamp', nullable: true })
  fechaEntrega?: Date;

  @ApiProperty({ 
    description: 'Estado actual de la adopción', 
    enum: EstadoAdopcion,
    example: EstadoAdopcion.PENDIENTE
  })
  @Column({ 
    type: 'text',
    default: EstadoAdopcion.PENDIENTE,
    enum: EstadoAdopcion
  })
  estado: EstadoAdopcion;

  @ApiProperty({ 
    description: 'Motivo de la solicitud de adopción', 
    example: 'Busco un compañero leal y cariñoso para mi familia' 
  })
  @Column({ type: 'text' })
  motivo: string;

  @ApiProperty({ 
    description: 'Observaciones adicionales sobre la adopción', 
    example: 'El adoptante tiene experiencia con mascotas grandes',
    required: false
  })
  @Column({ type: 'text', nullable: true })
  observaciones?: string;

  @ApiProperty({ 
    description: 'Documentos requeridos para la adopción', 
    example: 'DNI, comprobante de domicilio, referencia personal',
    required: false
  })
  @Column({ type: 'text', nullable: true })
  documentosRequeridos?: string;

  @ApiProperty({ 
    description: 'Costo de adopción si aplica', 
    example: 150.00,
    required: false
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  costoAdopcion?: number;

  @ApiProperty({ 
    description: 'Indica si la adopción está activa en el sistema', 
    example: true 
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ 
    description: 'Fecha de creación del registro', 
    example: '2026-03-20T20:00:00.000Z' 
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ 
    description: 'Fecha de última actualización', 
    example: '2026-03-20T20:00:00.000Z' 
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
