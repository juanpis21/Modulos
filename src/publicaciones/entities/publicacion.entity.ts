import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('publicaciones')
export class Publicacion {
  @ApiProperty({ 
    description: 'ID único de la publicación', 
    example: 1 
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ 
    description: 'Descripción de la publicación', 
    example: 'Mi mascota necesita un nuevo hogar...' 
  })
  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @ApiProperty({ 
    description: 'URL de la imagen de la publicación', 
    example: 'https://example.com/imagen.jpg',
    required: false
  })
  @Column({ type: 'text', nullable: true })
  imagen?: string;

  @ApiProperty({ 
    description: 'Autor de la publicación', 
    type: () => User 
  })
  @ManyToOne(() => User)
  autor: User;

  @ApiProperty({ 
    description: 'ID del autor de la publicación', 
    example: 25 
  })
  @Column()
  autorId: number;

  @ApiProperty({ 
    description: 'Indica si la publicación está activa en el sistema', 
    example: true 
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ 
    description: 'Fecha de creación del registro', 
    example: '2026-03-20T20:00:00.000Z' 
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ 
    description: 'Fecha de última actualización', 
    example: '2026-03-20T20:00:00.000Z' 
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
