import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsEnum, IsNotEmpty, IsDateString, Length, Min, Max } from 'class-validator';
import { EstadoAdopcion } from '../entities/adopcion.entity';

export class CreateAdopcionDto {
  @ApiProperty({ 
    description: 'ID de la mascota que será adoptada', 
    example: 1 
  })
  @IsNumber()
  @IsNotEmpty()
  mascotaId: number;

  @ApiProperty({ 
    description: 'ID del usuario adoptante', 
    example: 2 
  })
  @IsNumber()
  @IsNotEmpty()
  adoptanteId: number;

  @ApiProperty({ 
    description: 'ID de la veterinaria que gestiona la adopción', 
    example: 1 
  })
  @IsNumber()
  @IsNotEmpty()
  veterinariaId: number;

  @ApiProperty({ 
    description: 'Fecha de solicitud de adopción', 
    example: '2026-03-20T10:30:00.000Z' 
  })
  @IsDateString()
  @IsNotEmpty()
  fechaSolicitud: string;

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
    example: EstadoAdopcion.PENDIENTE 
  })
  @IsEnum(EstadoAdopcion)
  @IsNotEmpty()
  estado: EstadoAdopcion;

  @ApiProperty({ 
    description: 'Motivo de la solicitud de adopción', 
    example: 'Busco un compañero leal y cariñoso para mi familia' 
  })
  @IsString()
  @IsNotEmpty()
  @Length(10, 500)
  motivo: string;

  @ApiProperty({ 
    description: 'Observaciones adicionales sobre la adopción', 
    example: 'El adoptante tiene experiencia con mascotas grandes',
    required: false
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  observaciones?: string;

  @ApiProperty({ 
    description: 'Documentos requeridos para la adopción', 
    example: 'DNI, comprobante de domicilio, referencia personal',
    required: false
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  documentosRequeridos?: string;

  @ApiProperty({ 
    description: 'Costo de adopción si aplica', 
    example: 150.00,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999999)
  costoAdopcion?: number;

  @ApiProperty({ 
    description: 'Indica si la adopción está activa en el sistema', 
    example: true 
  })
  @IsOptional()
  isActive?: boolean;
}
