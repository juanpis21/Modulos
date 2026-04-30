import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Pet } from '../../pets/entities/pet.entity';

export enum EstadoReporte {
  PENDIENTE = 'PENDIENTE',
  EN_REVISION = 'EN_REVISION',
  RESUELTO = 'RESUELTO',
}

@Entity('reportes_maltrato')
export class ReporteMaltrato {
  @ApiProperty({ description: 'ID del reporte', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Descripción detallada de la situación y posible ubicación' })
  @Column({ type: 'text' })
  descripcion: string;

  @ApiProperty({ description: 'Estado actual de la investigación', enum: EstadoReporte })
  @Column({ type: 'enum', enum: EstadoReporte, default: EstadoReporte.PENDIENTE })
  estado: EstadoReporte;

  @ApiProperty({ description: 'ID del Usuario denunciante (Obligatorio)' })
  @Column({ name: 'usuarioId' })
  usuarioId: number;

  @ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuarioId' })
  usuario: User;

  @ApiProperty({ description: 'ID de la mascota (Opcional, en caso de estar registrado en el sistema)', nullable: true })
  @Column({ name: 'mascotaId', nullable: true })
  mascotaId: number;

  @ManyToOne(() => Pet, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'mascotaId' })
  mascota: Pet;

  @ApiProperty({ description: 'Fecha de creación del reporte original' })
  @CreateDateColumn()
  fecha: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
