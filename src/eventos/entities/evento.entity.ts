import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Veterinaria } from '../../veterinarias/entities/veterinaria.entity';

@Entity('eventos')
export class Evento {
  @ApiProperty({ description: 'ID único del evento', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Título de la campaña o evento', example: 'Gran Feria de Adopción' })
  @Column({ type: 'varchar', length: 255 })
  titulo: string;

  @ApiProperty({ description: 'Descripción detallada', example: 'Ven y dale un hogar a un peludito.' })
  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @ApiProperty({ description: 'URL de la imagen o afiche publicitario', required: false })
  @Column({ type: 'varchar', length: 500, nullable: true })
  imagen: string;

  @ApiProperty({ description: 'Fecha de inicio programada' })
  @Column({ type: 'date' })
  fechaInicio: Date;

  @ApiProperty({ description: 'Fecha de cierre programada' })
  @Column({ type: 'date' })
  fechaFin: Date;

  @ApiProperty({ description: 'ID de la veterinaria que lo organiza' })
  @Column({ name: 'veterinariaId' })
  veterinariaId: number;

  @ManyToOne(() => Veterinaria, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'veterinariaId' })
  veterinaria: Veterinaria;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
