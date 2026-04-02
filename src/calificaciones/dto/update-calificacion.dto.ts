import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsEnum, IsOptional, Min, Max } from 'class-validator';
import { EstadoCalificacion } from './create-calificacion.dto';

export class UpdateCalificacionDto {
  @ApiProperty({ 
    description: 'Puntuación del servicio (1-5)', 
    example: 5,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  puntuacion?: number;

  @ApiProperty({ 
    description: 'Comentario de la calificación', 
    example: 'Excelente servicio, muy profesional el veterinario',
    required: false
  })
  @IsOptional()
  @IsString()
  comentario?: string;

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
