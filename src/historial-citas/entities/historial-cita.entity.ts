import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { Cita } from '../../citas/entities/cita.entity';
import { User } from '../../users/entities/user.entity';

@Entity('historial_citas')
export class HistorialCita {
  @ApiProperty({ 
    description: 'ID único del registro de historial', 
    example: 1 
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ 
    description: 'Cita asociada a este registro de historial', 
    type: () => Cita 
  })
  @ManyToOne(() => Cita, cita => cita.historial)
  cita: Cita;

  @ApiProperty({ 
    description: 'Tipo de cambio realizado', 
    example: 'CREACION',
    enum: ['CREACION', 'ACTUALIZACION', 'CANCELACION', 'COMPLETACION']
  })
  @Column({ 
    length: 20,
    enum: ['CREACION', 'ACTUALIZACION', 'CANCELACION', 'COMPLETACION']
  })
  tipoCambio: string;

  @ApiProperty({ 
    description: 'Descripción del cambio realizado', 
    example: 'Se creó la cita para control general' 
  })
  @Column({ type: 'text' })
  descripcion: string;

  @ApiProperty({ 
    description: 'Valor anterior del campo cambiado', 
    required: false,
    example: 'Programada'
  })
  @Column({ type: 'text', nullable: true })
  valorAnterior?: string;

  @ApiProperty({ 
    description: 'Nuevo valor del campo cambiado', 
    required: false,
    example: 'Cancelada'
  })
  @Column({ type: 'text', nullable: true })
  valorNuevo?: string;

  @ApiProperty({ 
    description: 'Usuario que realizó el cambio', 
    type: () => User 
  })
  @ManyToOne(() => User, user => user.historialCitas)
  usuario: User;

  @ApiProperty({ 
    description: 'Fecha y hora del registro del historial', 
    example: '2026-03-20T10:30:00.000Z' 
  })
  @CreateDateColumn()
  fechaRegistro: Date;
}
