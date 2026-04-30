import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum EstadoNotificacion {
  LEIDO = 'LEIDO',
  NO_LEIDO = 'NO_LEIDO'
}

export enum TipoNotificacion {
  INFO = 'INFO',
  ALERTA = 'ALERTA',
  EXITO = 'EXITO',
  ERROR = 'ERROR'
}

@Entity('notificaciones')
export class Notificacion {
  @ApiProperty({ description: 'ID único de la notificación', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Mensaje descriptivo', example: 'Tu compra ha sido procesada con éxito.' })
  @Column({ type: 'text' })
  mensaje: string;

  @ApiProperty({ description: 'Tipo o severidad de la alerta', enum: TipoNotificacion })
  @Column({ type: 'enum', enum: TipoNotificacion, default: TipoNotificacion.INFO })
  tipo: TipoNotificacion;

  @ApiProperty({ description: 'Estado de lectura', enum: EstadoNotificacion })
  @Column({ type: 'enum', enum: EstadoNotificacion, default: EstadoNotificacion.NO_LEIDO })
  estado: EstadoNotificacion;

  @ApiProperty({ description: 'ID del usuario dueño de la notificación' })
  @Column({ name: 'usuarioId' })
  usuarioId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuarioId' })
  usuario: User;

  @ApiProperty({ description: 'Fecha de creación' })
  @CreateDateColumn()
  fecha: Date;
}
