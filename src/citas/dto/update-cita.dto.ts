import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsDateString, IsEnum, MinLength, MaxLength, IsBoolean } from 'class-validator';
import { CitaEstado } from './create-cita.dto';

export class UpdateCitaDto {
  @ApiProperty({ 
    description: 'Motivo de la cita', 
    example: 'Control general y vacunación',
    required: false
  })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(500)
  motivo?: string;

  @ApiProperty({ 
    description: 'Fecha y hora de la cita', 
    example: '2026-03-20T10:30:00.000Z',
    required: false
  })
  @IsOptional()
  @IsDateString()
  fechaHora?: string;

  @ApiProperty({ 
    description: 'Estado de la cita', 
    example: 'Completada',
    enum: CitaEstado,
    required: false
  })
  @IsOptional()
  @IsEnum(CitaEstado)
  estado?: CitaEstado;

  @ApiProperty({ 
    description: 'Notas adicionales de la cita', 
    example: 'El paciente es nervioso, se necesita manejo especial',
    required: false
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notas?: string;

  @ApiProperty({ 
    description: 'ID del usuario que solicita la cita', 
    example: 1,
    required: false
  })
  @IsOptional()
  @IsNumber()
  usuarioId?: number;

  @ApiProperty({ 
    description: 'ID del veterinario asignado', 
    example: 1,
    required: false
  })
  @IsOptional()
  @IsNumber()
  idVeterinario?: number;

  @ApiProperty({ 
    description: 'ID de la mascota del paciente', 
    example: 1,
    required: false
  })
  @IsOptional()
  @IsNumber()
  mascotaId?: number;

  @ApiProperty({ 
    description: 'ID de la historia clínica asociada', 
    example: 1,
    required: false
  })
  @IsOptional()
  @IsNumber()
  idHistoriaClinica?: number;

  @ApiProperty({ 
    description: 'Indica si la cita está activa en el sistema', 
    example: true 
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
