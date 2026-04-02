import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, MinLength, MaxLength, IsEnum } from 'class-validator';

export class UpdateEmergenciaDto {
  @ApiProperty({ 
    description: 'Tipo de emergencia', 
    example: 'accidente',
    required: false,
    enum: ['accidente', 'enfermedad', 'intoxicacion', 'parto', 'cirugia', 'otro']
  })
  @IsOptional()
  @IsString()
  @IsEnum(['accidente', 'enfermedad', 'intoxicacion', 'parto', 'cirugia', 'otro'])
  @MaxLength(20)
  tipo?: string;

  @ApiProperty({ 
    description: 'Descripción detallada de la emergencia', 
    example: 'Atropellamiento vehicular, mascota presenta fractura en pata trasera y sangrado',
    required: false
  })
  @IsOptional()
  @IsString()
  @MinLength(10)
  descripcion?: string;

  @ApiProperty({ 
    description: 'ID de la mascota que presenta la emergencia', 
    example: 1,
    required: false
  })
  @IsOptional()
  @IsNumber()
  mascotaId?: number;

  @ApiProperty({ 
    description: 'ID del rol del veterinario que atiende la emergencia', 
    example: 1,
    required: false
  })
  @IsOptional()
  @IsNumber()
  veterinarioId?: number;

  @ApiProperty({ 
    description: 'ID de la veterinaria donde se registra la emergencia', 
    example: 1,
    required: false
  })
  @IsOptional()
  @IsNumber()
  veterinariaId?: number;

  @ApiProperty({ 
    description: 'Fecha y hora de la emergencia', 
    example: '2026-03-19T23:00:00.000Z',
    required: false
  })
  @IsOptional()
  fechayhora?: Date;

  @ApiProperty({ 
    description: 'Indica si la emergencia está activa en el sistema', 
    example: true,
    required: false
  })
  @IsOptional()
  isActive?: boolean;
}
