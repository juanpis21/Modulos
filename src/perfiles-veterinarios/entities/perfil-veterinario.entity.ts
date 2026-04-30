import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToOne, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Veterinaria } from '../../veterinarias/entities/veterinaria.entity';
import { Cita } from '../../citas/entities/cita.entity';
import { Role } from '../../roles/entities/role.entity';

@Entity('perfiles_veterinarios')
export class PerfilVeterinario {
  @ApiProperty({ 
    description: 'ID único del perfil veterinario', 
    example: 1 
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ 
    description: 'Especialidad del veterinario', 
    example: 'Medicina General Canina' 
  })
  @Column({ length: 100 })
  especialidad: string;

  @ApiProperty({ 
    description: 'Número de matrícula profesional', 
    example: 'MV-2023-1234' 
  })
  @Column({ length: 50, unique: true })
  matricula: string;

  @ApiProperty({ 
    description: 'Años de experiencia', 
    example: 5 
  })
  @Column({ type: 'int', default: 0 })
  aniosExperiencia: number;

  @ApiProperty({ 
    description: 'Universidad de egreso', 
    example: 'Universidad Nacional de Veterinaria',
    required: false
  })
  @Column({ length: 200, nullable: true })
  universidad?: string;

  @ApiProperty({ 
    description: 'Teléfono de contacto profesional', 
    example: '+1234567890',
    required: false
  })
  @Column({ length: 20, nullable: true })
  telefonoProfesional?: string;

  @ApiProperty({ 
    description: 'Email profesional', 
    example: 'dr.veterinario@clinica.com',
    required: false
  })
  @Column({ length: 100, nullable: true })
  emailProfesional?: string;

  @ApiProperty({ 
    description: 'Biografía o descripción profesional', 
    example: 'Veterinario con especialización en medicina canina y felina',
    required: false
  })
  @Column({ type: 'text', nullable: true })
  biografia?: string;

  @ApiProperty({ 
    description: 'Usuario asociado al perfil veterinario', 
    type: () => User 
  })
  @OneToOne(() => User, user => user.perfilVeterinario)
  @JoinColumn()
  usuario: User;

  @ManyToOne(() => Role, role => role.perfilesVeterinarios)
  rol: Role;

  @ApiProperty({ 
    description: 'Veterinaria principal donde trabaja', 
    type: () => Veterinaria 
  })
  @ManyToOne(() => Veterinaria, veterinaria => veterinaria.veterinarios)
  veterinariaPrincipal?: Veterinaria;

  @ApiProperty({ 
    description: 'Citas asignadas', 
    type: () => [Cita] 
  })
  @OneToMany(() => Cita, cita => cita.veterinario)
  citas: Cita[];

  @ApiProperty({ 
    description: 'Indica si el perfil veterinario está activo', 
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
