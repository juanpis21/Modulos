import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from 'typeorm';
import { Pet } from '../../pets/entities/pet.entity';
import { PerfilVeterinario } from '../../perfiles-veterinarios/entities/perfil-veterinario.entity';
import { Emergencia } from '../../emergencias/entities/emergencia.entity';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('veterinarias')
export class Veterinaria {
  @ApiProperty({ 
    description: 'ID único de la veterinaria', 
    example: 1 
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ 
    description: 'Nombre de la veterinaria', 
    example: 'Clínica Veterinaria San Felipe' 
  })
  @Column({ length: 100 })
  nombre: string;

  @ApiProperty({ 
    description: 'Dirección de la veterinaria', 
    example: 'Calle Principal #123, Ciudad' 
  })
  @Column({ type: 'text' })
  direccion: string;

  @ApiProperty({ 
    description: 'Teléfono de contacto', 
    example: '+1234567890' 
  })
  @Column({ length: 20 })
  telefono: string;

  @ApiProperty({ 
    description: 'Email de contacto', 
    example: 'contacto@clinicavet.com' 
  })
  @Column({ length: 100 })
  email: string;

  @ApiProperty({ 
    description: 'Descripción de la veterinaria', 
    example: 'Clínica veterinaria con más de 10 años de experiencia, especializada en atención de mascotas pequeñas y grandes.' 
  })
  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @ApiProperty({ 
    description: 'Estado de la veterinaria', 
    example: 'Activa' 
  })
  @OneToMany(() => PerfilVeterinario, perfilVeterinario => perfilVeterinario.veterinariaPrincipal)
  veterinarios: PerfilVeterinario[];

  @OneToMany(() => Emergencia, emergencia => emergencia.veterinaria)
  emergencias: Emergencia[];

  @ApiProperty({ 
    description: 'Productos del inventario de esta veterinaria', 
    type: () => [Producto] 
  })
  @OneToMany(() => Producto, producto => producto.veterinaria)
  productos: Producto[];

  @ApiProperty({ 
    description: 'RUT de la veterinaria', 
    example: '76.123.456-7' 
  })
  @Column({ length: 20, nullable: true })
  rut: string;

  @ApiProperty({ 
    description: 'Indica si la veterinaria está activa en el sistema', 
    example: true 
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ 
    description: 'Fecha de creación del registro', 
    example: '2026-03-19T20:00:00.000Z' 
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ 
    description: 'Fecha de última actualización', 
    example: '2026-03-19T20:00:00.000Z' 
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
