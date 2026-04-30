import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { Pet } from '../../pets/entities/pet.entity';
import { Role } from '../../roles/entities/role.entity';
import { Veterinaria } from '../../veterinarias/entities/veterinaria.entity';
import { User } from '../../users/entities/user.entity';

@Entity('historias_clinicas')
export class HistoriaClinica {
  @ApiProperty({ description: 'ID de la Historia Clínica', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Diagnóstico general médico', example: 'Paciente sano, controles al día.' })
  @Column({ type: 'text', nullable: true })
  diagnostico: string;

  @ApiProperty({ description: 'Historial de tratamientos activos o pasados' })
  @Column({ type: 'text', nullable: true })
  tratamiento: string;

  @ApiProperty({ description: 'Última fecha de actualización del expediente' })
  @UpdateDateColumn()
  fecha: Date;
  
  @ApiProperty({ description: 'Fecha de apertura del expediente' })
  @CreateDateColumn()
  createdAt: Date;

  // RELACIONES ---

  @ApiProperty({ description: 'El paciente (mascota). Solo 1 paciente puede tener 1 historia.' })
  @Column({ name: 'mascotaId', unique: true })
  mascotaId: number;

  @OneToOne(() => Pet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'mascotaId' })
  mascota: Pet;

  @ApiProperty({ description: 'El último Veterinario que modificó este registro' })
  @Column({ name: 'veterinarioId' })
  veterinarioId: number;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'veterinarioId' })
  veterinario: Role;

  @ApiProperty({ description: 'Clínica responsable del expediente' })
  @Column({ name: 'veterinariaId' })
  veterinariaId: number;

  @ManyToOne(() => Veterinaria)
  @JoinColumn({ name: 'veterinariaId' })
  veterinaria: Veterinaria;

  @ApiProperty({ description: 'Dueño de la mascota en el momento del registro' })
  @Column({ name: 'usuarioId' })
  usuarioId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'usuarioId' })
  usuario: User;
}
