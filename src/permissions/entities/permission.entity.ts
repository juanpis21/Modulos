import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export enum ModuleName {
  INICIO = 'inicio',
  SOBRE_NOSOTROS = 'sobre-nosotros',
  ADOPCION = 'adopcion',
  TIENDA = 'tienda',
  REPORTE = 'reporte',
  CALIFICACION = 'calificacion',
  VETERINARIO = 'veterinario',
  SERVICIOS = 'servicios',
  PASARELA_PAGOS = 'pasarela-pagos',
  PERFIL_USUARIO = 'perfil-usuario',
  PERFIL_VETERINARIO = 'perfil-veterinario',
  PANEL_ADMIN = 'panel-admin',
  RECOVERY = 'recovery',
}

@Entity('permissions')
export class Permission {
  @ApiProperty({ example: 1, description: 'ID del permiso' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ 
    example: ModuleName.PERFIL_USUARIO, 
    description: 'Nombre del módulo',
    enum: ModuleName
  })
  @Column({
    type: 'enum',
    enum: ModuleName,
  })
  moduleName: ModuleName;

  @ApiProperty({ example: true, description: 'Si tiene acceso al módulo' })
  @Column({ default: true })
  canAccess: boolean;

  @ApiProperty({ example: true, description: 'Si puede crear' })
  @Column({ default: true })
  canCreate: boolean;

  @ApiProperty({ example: true, description: 'Si puede leer' })
  @Column({ default: true })
  canRead: boolean;

  @ApiProperty({ example: true, description: 'Si puede actualizar' })
  @Column({ default: true })
  canUpdate: boolean;

  @ApiProperty({ example: true, description: 'Si puede eliminar' })
  @Column({ default: true })
  canDelete: boolean;

  @ApiProperty({ description: 'Usuario asociado', type: () => User })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @ApiProperty({ description: 'Fecha de creación' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de actualización' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
