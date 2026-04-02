import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Pet } from '../../pets/entities/pet.entity';
import { Role } from '../../roles/entities/role.entity';
import { Veterinaria } from '../../veterinarias/entities/veterinaria.entity';

@Entity('emergencias')
export class Emergencia {
  @ApiProperty({ 
    description: 'ID único de la emergencia', 
    example: 1 
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ 
    description: 'Tipo de emergencia', 
    example: 'accidente',
    enum: ['accidente', 'enfermedad', 'intoxicacion', 'parto', 'cirugia', 'otro']
  })
  @Column({ 
    length: 20,
    enum: ['accidente', 'enfermedad', 'intoxicacion', 'parto', 'cirugia', 'otro']
  })
  tipo: string;

  @ApiProperty({ 
    description: 'Fecha y hora de la emergencia', 
    example: '2026-03-19T23:00:00.000Z' 
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechayhora: Date;

  @ApiProperty({ 
    description: 'Descripción detallada de la emergencia', 
    example: 'Atropellamiento vehicular, mascota presenta fractura en pata trasera y sangrado' 
  })
  @Column({ type: 'text' })
  descripcion: string;

  @ApiProperty({ 
    description: 'Mascota que presenta la emergencia', 
    type: () => Pet 
  })
  @ManyToOne(() => Pet, pet => pet.emergencias)
  mascota: Pet;

  @ApiProperty({ 
    description: 'Veterinario que atiende la emergencia', 
    type: () => Role 
  })
  @ManyToOne(() => Role, role => role.emergencias)
  veterinario: Role;

  @ApiProperty({ 
    description: 'Veterinaria donde se registra la emergencia', 
    type: () => Veterinaria 
  })
  @ManyToOne(() => Veterinaria, veterinaria => veterinaria.emergencias)
  veterinaria: Veterinaria;

  @ApiProperty({ 
    description: 'Indica si la emergencia está activa en el sistema', 
    example: true 
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ 
    description: 'Fecha de creación del registro', 
    example: '2026-03-19T23:00:00.000Z' 
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ 
    description: 'Fecha de última actualización', 
    example: '2026-03-19T23:00:00.000Z' 
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
