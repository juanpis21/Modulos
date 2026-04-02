import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Veterinaria } from '../../veterinarias/entities/veterinaria.entity';

@Entity('servicios')
export class Servicio {
  @ApiProperty({ 
    description: 'ID único del servicio', 
    example: 1 
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ 
    description: 'Nombre del servicio', 
    example: 'Consulta General' 
  })
  @Column({ length: 200 })
  nombre: string;

  @ApiProperty({ 
    description: 'Descripción detallada del servicio', 
    example: 'Consulta veterinaria general para revisión de salud de mascotas' 
  })
  @Column({ type: 'text' })
  descripcion: string;

  @ApiProperty({ 
    description: 'Precio base del servicio', 
    example: 25000.00 
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precioBase: number;

  @ApiProperty({ 
    description: 'Duración estimada en minutos', 
    example: 30 
  })
  @Column({ type: 'int', nullable: true })
  duracionMinutos?: number;

  @ApiProperty({ 
    description: 'Tipo de servicio', 
    example: 'CONSULTA',
    enum: ['CONSULTA', 'CIRUGIA', 'VACUNACION', 'DESparasitacion', 'ESTETICA', 'LABORATORIO', 'EMERGENCIA', 'CHECKUP']
  })
  @Column({ 
    length: 20,
    enum: ['CONSULTA', 'CIRUGIA', 'VACUNACION', 'DESparasitacion', 'ESTETICA', 'LABORATORIO', 'EMERGENCIA', 'CHECKUP']
  })
  tipoServicio: string;

  @ApiProperty({ 
    description: 'Requiere cita previa', 
    example: true 
  })
  @Column({ default: true })
  requiereCita: boolean;

  @ApiProperty({ 
    description: 'Estado del servicio', 
    example: true 
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ 
    description: 'ID de la veterinaria', 
    example: 1 
  })
  @Column({ name: 'veterinariaId' })
  veterinariaId: number;

  @ApiProperty({ 
    description: 'Veterinaria que ofrece el servicio', 
    type: () => Veterinaria 
  })
  @ManyToOne(() => Veterinaria, veterinaria => veterinaria.id)
  veterinaria: Veterinaria;

  @ApiProperty({ 
    description: 'URL de imagen del servicio', 
    example: 'https://example.com/images/consulta-general.jpg',
    required: false
  })
  @Column({ length: 500, nullable: true })
  imagen?: string;

  @ApiProperty({ 
    description: 'Etiquetas para búsqueda', 
    example: 'consulta,general,revision,salud',
    required: false
  })
  @Column({ length: 300, nullable: true })
  etiquetas?: string;

  @ApiProperty({ description: 'Fecha de creación del registro', example: '2026-03-20T10:30:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización', example: '2026-03-20T10:30:00.000Z' })
  @UpdateDateColumn()
  updatedAt: Date;
}
