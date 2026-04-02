import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinTable, OneToMany, OneToOne } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Pet } from '../../pets/entities/pet.entity';
import { Cita } from '../../citas/entities/cita.entity';
import { PerfilVeterinario } from '../../perfiles-veterinarios/entities/perfil-veterinario.entity';
import { Adopcion } from '../../adopciones/entities/adopcion.entity';
import { HistorialCita } from '../../historial-citas/entities/historial-cita.entity';

@Entity('users')
export class User {
  @ApiProperty({ description: 'ID del usuario' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Nombre de usuario', example: 'juanp' })
  @Column({ unique: true })
  username: string;

  @ApiProperty({ description: 'Email del usuario', example: 'juan@example.com' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: 'Contraseña del usuario (encriptada)' })
  @Column()
  password: string;

  @ApiProperty({ description: 'Nombre completo', example: 'Juan Pérez' })
  @Column({ nullable: true })
  fullName: string;

  @ApiProperty({ description: 'Teléfono', example: '+1234567890', required: false })
  @Column({ nullable: true })
  phone: string;

  @ApiProperty({ description: 'Estado del usuario', example: true })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Roles del usuario', type: () => [Role] })
  @ManyToMany(() => Role, role => role.users, { cascade: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];

  @OneToMany(() => Pet, pet => pet.owner)
  pets: Pet[];

  @OneToMany(() => Cita, cita => cita.usuario)
  citas: Cita[];

  @OneToMany(() => Adopcion, adopcion => adopcion.adoptante)
  adopcionesRealizadas: Adopcion[];

  @OneToMany(() => HistorialCita, historialCita => historialCita.usuario)
  historialCitas: HistorialCita[];

  @OneToOne(() => PerfilVeterinario, perfilVeterinario => perfilVeterinario.usuario)
  perfilVeterinario: PerfilVeterinario;

  @ApiProperty({ description: 'Fecha de creación del registro', example: '2026-03-17T20:00:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización', example: '2026-03-17T20:00:00.000Z' })
  @UpdateDateColumn()
  updatedAt: Date;
}
