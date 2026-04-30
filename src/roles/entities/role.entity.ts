import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { PerfilVeterinario } from '../../perfiles-veterinarios/entities/perfil-veterinario.entity';
import { Emergencia } from '../../emergencias/entities/emergencia.entity';
import { Cita } from '../../citas/entities/cita.entity';
import { Module } from '../../modules/entities/module.entity';

@Entity('roles')
export class Role {
  @ApiProperty({ description: 'ID del rol' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Nombre del rol', example: 'admin' })
  @Column({ unique: true })
  name: string;

  @ApiProperty({ description: 'Descripción del rol', example: 'Administrador del sistema' })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ description: 'Usuarios con este rol', type: () => [User] })
  @OneToMany(() => User, user => user.role)
  users: User[];

  @ApiProperty({ description: 'Perfiles veterinarios con este rol', type: () => [PerfilVeterinario] })
  @OneToMany(() => PerfilVeterinario, perfilVeterinario => perfilVeterinario.rol)
  perfilesVeterinarios: PerfilVeterinario[];

  @ApiProperty({ description: 'Emergencias atendidas con este rol', type: () => [Emergencia] })
  @OneToMany(() => Emergencia, emergencia => emergencia.veterinario)
  emergencias: Emergencia[];

  @ApiProperty({ description: 'Citas asignadas a este rol', type: () => [Cita] })
  @OneToMany(() => Cita, cita => cita.veterinario)
  citas: Cita[];

  @ApiProperty({ description: 'Módulos a los que este rol da acceso', type: () => [Module] })
  @ManyToMany(() => Module, (module) => module.roles)
  modules: Module[];

  @ApiProperty({ description: 'Fecha de creación' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de actualización' })
  @UpdateDateColumn()
  updatedAt: Date;
}
