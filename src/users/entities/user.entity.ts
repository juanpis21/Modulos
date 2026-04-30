import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne, ManyToOne, ManyToMany, JoinColumn, JoinTable } from 'typeorm';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { Pet } from '../../pets/entities/pet.entity';
import { Cita } from '../../citas/entities/cita.entity';
import { PerfilVeterinario } from '../../perfiles-veterinarios/entities/perfil-veterinario.entity';
import { HistorialCita } from '../../historial-citas/entities/historial-cita.entity';
import { MovimientoInventario } from '../../movimientos/entities/movimiento-inventario.entity';
import { Role } from '../../roles/entities/role.entity';

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

  @Column()
  password: string;

  @ApiProperty({ description: 'Nombre completo', example: 'Juan Pérez' })
  @Column({ nullable: true })
  fullName: string;

  @ApiProperty({ description: 'Nombres', example: 'Juan Carlos', required: false })
  @Column({ nullable: true })
  firstName: string;

  @ApiProperty({ description: 'Apellidos', example: 'Pérez García', required: false })
  @Column({ nullable: true })
  lastName: string;

  @ApiProperty({ description: 'Teléfono', example: '+1234567890', required: false })
  @Column({ nullable: true })
  phone: string;

  @ApiProperty({ description: 'Tipo de documento', example: 'Cédula', required: false })
  @Column({ nullable: true })
  documentType: string;

  @ApiProperty({ description: 'Número de documento', example: '12345678', required: false })
  @Column({ nullable: true })
  documentNumber: string;

  @ApiProperty({ description: 'Edad', example: 25, required: false })
  @Column({ nullable: true })
  age: number;

  @ApiProperty({ description: 'Dirección', example: 'Calle 123 #45-67', required: false })
  @Column({ nullable: true })
  address: string;

  @ApiProperty({ description: 'Estado del usuario', example: true })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Imagen de perfil (URL o Base64)', required: false })
  @Column({ type: 'text', nullable: true })
  avatar: string;

  @ApiProperty({ description: 'ID del rol del usuario', example: 2 })
  @Column({ nullable: true })
  roleId: number;

  @ApiProperty({ description: 'Rol del usuario', type: () => Role })
  @ManyToOne(() => Role, { eager: true })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @OneToMany(() => Pet, pet => pet.owner)
  pets: Pet[];

  @ApiHideProperty()
  @OneToMany(() => Cita, cita => cita.usuario)
  citas: Cita[];

  @ApiHideProperty()
  @OneToMany(() => HistorialCita, historialCita => historialCita.usuario)
  historialCitas: HistorialCita[];

  @OneToMany(() => MovimientoInventario, movimiento => movimiento.usuario)
  movimientosInventario: MovimientoInventario[];

  @OneToOne(() => PerfilVeterinario, perfilVeterinario => perfilVeterinario.usuario)
  perfilVeterinario: PerfilVeterinario;

  @ApiProperty({ description: 'Fecha de creación del registro', example: '2026-03-17T20:00:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización', example: '2026-03-17T20:00:00.000Z' })
  @UpdateDateColumn()
  updatedAt: Date;
}
