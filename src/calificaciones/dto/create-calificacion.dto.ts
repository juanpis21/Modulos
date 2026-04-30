import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsEnum, IsOptional, Min, Max } from 'class-validator';

export enum EstadoCalificacion {
  PENDIENTE = 'PENDIENTE',
  APROBADA = 'APROBADA',
  RECHAZADA = 'RECHAZADA'
}

export class CreateCalificacionDto {
  @ApiProperty({ 
    description: 'Puntuación del servicio (1-5)', 
    example: 5 
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  puntuacion: number;

  @ApiProperty({ 
    description: 'Comentario de la calificación', 
    example: 'Excelente servicio, muy profesional el veterinario',
    required: false
  })
  @IsOptional()
  @IsString()
  comentario?: string;

  @ApiProperty({ 
    description: 'ID del usuario que califica (opcional, se usa JWT por defecto)', 
    example: 1,
    required: false
  })
  @IsOptional()
  @IsNumber()
  usuarioId?: number;

  @ApiProperty({ 
    description: 'ID del servicio calificado', 
    example: 1 
  })
  @IsNumber()
  servicioId: number;

  @ApiProperty({ 
    description: 'ID del veterinario atendido (opcional)', 
    example: 2,
    required: false
  })
  @IsOptional()
  @IsNumber()
  veterinarioId?: number;

  @ApiProperty({ 
    description: 'Estado de la calificación', 
    example: EstadoCalificacion.APROBADA,
    enum: EstadoCalificacion,
    required: false
  })
  @IsOptional()
  @IsEnum(EstadoCalificacion)
  estado?: EstadoCalificacion;
}
