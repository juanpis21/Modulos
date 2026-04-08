import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('token_recuperacion')
export class TokenRecuperacion {
  @ApiProperty({ description: 'ID de la solicitud', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'String alfanumérico generado de un solo uso' })
  @Column({ type: 'varchar', unique: true })
  token: string;

  @ApiProperty({ description: 'Fecha de fallecimiento/expiración física del token' })
  @Column({ type: 'timestamp' })
  fechaExpiracion: Date;

  @ApiProperty({ description: 'ID del Usuario' })
  @Column({ name: 'usuarioId' })
  usuarioId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuarioId' })
  usuario: User;

  @CreateDateColumn()
  createdAt: Date;
}
