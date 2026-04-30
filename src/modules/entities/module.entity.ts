import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../roles/entities/role.entity';

@Entity('modules')
export class Module {
  @ApiProperty({ example: 1, description: 'ID del módulo' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'inicio', description: 'Nombre del módulo' })
  @Column({ unique: true })
  name: string;

  @ApiProperty({ example: 'Módulo de inicio', description: 'Descripción del módulo' })
  @Column()
  description: string;

  @ApiProperty({ description: 'Roles que tienen acceso a este módulo', type: () => [Role] })
  @ManyToMany(() => Role, (role) => role.modules)
  @JoinTable({
    name: 'role_modules',
    joinColumn: { name: 'moduleId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'roleId', referencedColumnName: 'id' },
  })
  roles: Role[];

  @ApiProperty({ description: 'Fecha de creación' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de actualización' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
