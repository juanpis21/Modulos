import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateHistoriaClinicaDto {
  @ApiProperty({ example: 1, description: 'ID de la mascota (Paciente)' })
  @IsNumber()
  @IsNotEmpty()
  mascotaId: number;

  @ApiProperty({ example: 4, description: 'ID del Veterinario responsable de la apertura' })
  @IsNumber()
  @IsNotEmpty()
  veterinarioId: number;

  @ApiProperty({ example: 1, description: 'ID de la veterinaria' })
  @IsNumber()
  @IsNotEmpty()
  veterinariaId: number;

  // El sistema derivaría el usuarioId automáticamente leyendo a quién le pertenece la mascota, 
  // pero lo exponemos en DTO por si un Admin lo ingresa forzadamente.
  @ApiProperty({ example: 2, description: 'ID del dueño de la mascota' })
  @IsNumber()
  @IsNotEmpty()
  usuarioId: number;

  @ApiProperty({ example: 'Sano. Primera revisión de cachorro. Sin anomalías.' })
  @IsString()
  @IsOptional()
  diagnostico?: string;

  @ApiProperty({ example: 'Desparasitación estándar (Drontal).' })
  @IsString()
  @IsOptional()
  tratamiento?: string;
}
