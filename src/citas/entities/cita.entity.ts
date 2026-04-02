import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Pet } from '../../pets/entities/pet.entity';
import { Role } from '../../roles/entities/role.entity';
import { HistorialCita } from '../../historial-citas/entities/historial-cita.entity';

@Entity('citas')
export class Cita {
  @ApiProperty({ 
    description: 'ID único de la cita', 
    example: 1 
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ 
    description: 'Motivo de la cita', 
    example: 'Control general y vacunación' 
  })
  @Column({ length: 500 })
  motivo: string;

  @ApiProperty({ 
    description: 'Fecha y hora de la cita', 
    example: '2026-03-20T10:30:00.000Z' 
  })
  @Column({ type: 'timestamp' })
  fechaHora: Date;

  @ApiProperty({ 
    description: 'Estado de la cita', 
    example: 'Programada',
    enum: ['Programada', 'En curso', 'Completada', 'Cancelada']
  })
  @Column({ 
    length: 20, 
    default: 'Programada',
    enum: ['Programada', 'En curso', 'Completada', 'Cancelada']
  })
  estado: string;

  @ApiProperty({ 
    description: 'Notas adicionales de la cita', 
    example: 'El paciente es nervioso, se necesita manejo especial',
    required: false
  })
  @Column({ type: 'text', nullable: true })
  notas?: string;

  @ApiProperty({ 
    description: 'Usuario que solicita la cita', 
    type: () => User 
  })
  @ManyToOne(() => User, user => user.citas)
  usuario: User;

  @ApiProperty({ 
    description: 'Veterinario asignado a la cita', 
    type: () => Role,
    required: false
  })
  @ManyToOne(() => Role, role => role.citas)
  veterinario: Role;

  @ApiProperty({ 
    description: 'Mascota del paciente', 
    type: () => Pet 
  })
  @ManyToOne(() => Pet, pet => pet.citas)
  mascota: Pet;

  @ApiProperty({ 
    description: 'Historial de cambios de esta cita', 
    type: () => [HistorialCita] 
  })
  @OneToMany(() => HistorialCita, historialCita => historialCita.cita)
  historial: HistorialCita[];

  @ApiProperty({ 
    description: 'Indica si la cita está activa en el sistema', 
    example: true 
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ 
    description: 'Fecha de creación del registro', 
    example: '2026-03-19T20:00:00.000Z' 
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ 
    description: 'Fecha de última actualización', 
    example: '2026-03-19T20:00:00.000Z' 
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
