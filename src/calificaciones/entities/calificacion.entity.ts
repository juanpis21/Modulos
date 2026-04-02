import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('calificaciones')
export class Calificacion {
  @ApiProperty({ 
    description: 'ID único de la calificación', 
    example: 1 
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ 
    description: 'Puntuación del servicio (1-5)', 
    example: 5 
  })
  @Column({ type: 'int' })
  puntuacion: number;

  @ApiProperty({ 
    description: 'Comentario de la calificación', 
    example: 'Excelente servicio, muy profesional el veterinario' 
  })
  @Column({ type: 'text', nullable: true })
  comentario?: string;

  @ApiProperty({ 
    description: 'Estado de la calificación', 
    example: 'APROBADA',
    enum: ['PENDIENTE', 'APROBADA', 'RECHAZADA']
  })
  @Column({ 
    length: 20,
    enum: ['PENDIENTE', 'APROBADA', 'RECHAZADA'],
    default: 'APROBADA'
  })
  estado: string;

  @ApiProperty({ 
    description: 'ID del usuario que califica', 
    example: 1 
  })
  @Column({ name: 'usuarioId' })
  usuarioId: number;

  @ApiProperty({ 
    description: 'Usuario que realiza la calificación', 
    type: () => User 
  })
  @ManyToOne(() => User, user => user.id)
  usuario: User;

  @ApiProperty({ 
    description: 'ID del servicio calificado', 
    example: 1 
  })
  @Column({ name: 'servicioId' })
  servicioId: number;

  @ApiProperty({ 
    description: 'ID del veterinario atendido (opcional)', 
    example: 2,
    required: false
  })
  @Column({ name: 'veterinarioId', nullable: true })
  veterinarioId?: number;

  @ApiProperty({ 
    description: 'Veterinario que fue atendido', 
    type: () => User,
    required: false
  })
  @ManyToOne(() => User, user => user.id)
  veterinario?: User;

  @ApiProperty({ description: 'Fecha de creación de la calificación', example: '2026-03-20T10:30:00.000Z' })
  @CreateDateColumn()
  fecha: Date;
}
