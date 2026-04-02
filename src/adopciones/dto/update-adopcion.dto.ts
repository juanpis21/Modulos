import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsEnum, IsDateString, Length, Min, Max } from 'class-validator';
import { EstadoAdopcion } from '../entities/adopcion.entity';

export class UpdateAdopcionDto {
  @ApiProperty({ 
    description: 'Fecha de aprobación de la adopción', 
    example: '2026-03-22T15:00:00.000Z',
    required: false
  })
  @IsOptional()
  @IsDateString()
  fechaAprobacion?: string;

  @ApiProperty({ 
    description: 'Fecha de entrega de la mascota', 
    example: '2026-03-25T10:00:00.000Z',
    required: false
  })
  @IsOptional()
  @IsDateString()
  fechaEntrega?: string;

  @ApiProperty({ 
    description: 'Estado actual de la adopción', 
    enum: EstadoAdopcion,
    required: false
  })
  @IsOptional()
  @IsEnum(EstadoAdopcion)
  estado?: EstadoAdopcion;

  @ApiProperty({ 
    description: 'Motivo de la solicitud de adopción', 
    example: 'Actualización del motivo de adopción',
    required: false
  })
  @IsOptional()
  @IsString()
  @Length(10, 500)
  motivo?: string;

  @ApiProperty({ 
    description: 'Observaciones adicionales sobre la adopción', 
    example: 'Se agregaron notas adicionales sobre la entrega',
    required: false
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  observaciones?: string;

  @ApiProperty({ 
    description: 'Documentos requeridos para la adopción', 
    example: 'DNI actualizado, comprobante de domicilio actualizado',
    required: false
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  documentosRequeridos?: string;

  @ApiProperty({ 
    description: 'Costo de adopción si aplica', 
    example: 200.00,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999999)
  costoAdopcion?: number;

  @ApiProperty({ 
    description: 'Indica si la adopción está activa en el sistema', 
    example: true,
    required: false
  })
  @IsOptional()
  isActive?: boolean;
}
