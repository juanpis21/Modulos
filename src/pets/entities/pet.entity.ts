import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Cita } from '../../citas/entities/cita.entity';
import { Emergencia } from '../../emergencias/entities/emergencia.entity';

@Entity('pets')
export class Pet {
  @ApiProperty({ 
    description: 'ID único de la mascota', 
    example: 1 
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ 
    description: 'Nombre de la mascota', 
    example: 'Firulais' 
  })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({ 
    description: 'Especie de la mascota', 
    example: 'Perro' 
  })
  @Column({ length: 50 })
  species: string;

  @ApiProperty({ 
    description: 'Raza de la mascota', 
    example: 'Labrador' 
  })
  @Column({ length: 50 })
  breed: string;

  @ApiProperty({ 
    description: 'Edad de la mascota', 
    example: 3 
  })
  @Column({ type: 'int' })
  age: number;

  @ApiProperty({ 
    description: 'Género de la mascota', 
    example: 'Macho' 
  })
  @Column({ length: 20 })
  gender: string;

  @ApiProperty({ 
    description: 'Color de la mascota', 
    example: 'Dorado' 
  })
  @Column({ length: 50 })
  color: string;

  @ApiProperty({ 
    description: 'Peso de la mascota en kg', 
    example: 25.5 
  })
  @Column({ type: 'decimal', precision: 5, scale: 2 })
  weight: number;

  @ApiProperty({ 
    description: 'Descripción o notas adicionales sobre la mascota', 
    example: 'Mascota muy juguetona y amigable' 
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    description: 'URL o base64 de la foto de la mascota',
    example: 'https://example.com/mascota.jpg',
    required: false
  })
  @Column({ type: 'text', nullable: true })
  foto: string;

  @ApiProperty({ 
    description: 'ID del dueño de la mascota', 
    example: 2 
  })
  @Column()
  ownerId: number;

  @ManyToOne(() => User, user => user.pets)
  owner: User;

  @OneToMany(() => Cita, cita => cita.mascota)
  citas: Cita[];

  @OneToMany(() => Emergencia, emergencia => emergencia.mascota)
  emergencias: Emergencia[];

  @ApiProperty({ 
    description: 'Indica si la mascota está activa en el sistema', 
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
