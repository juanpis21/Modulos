import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';

export enum TipoCambio {
  CREACION = 'CREACION',
  ACTUALIZACION = 'ACTUALIZACION',
  CANCELACION = 'CANCELACION',
  COMPLETACION = 'COMPLETACION'
}

export class CreateHistorialCitaDto {
  @ApiProperty({ 
    description: 'ID de la cita asociada', 
    example: 1 
  })
  @IsNumber()
  @IsNotEmpty()
  citaId: number;

  @ApiProperty({ 
    description: 'Tipo de cambio realizado', 
    enum: TipoCambio,
    example: TipoCambio.CREACION 
  })
  @IsEnum(TipoCambio)
  @IsNotEmpty()
  tipoCambio: TipoCambio;

  @ApiProperty({ 
    description: 'Descripción del cambio realizado', 
    example: 'Se creó la cita para control general y vacunación' 
  })
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiProperty({ 
    description: 'Valor anterior del campo cambiado', 
    example: 'Programada',
    required: false
  })
  @IsOptional()
  @IsString()
  valorAnterior?: string;

  @ApiProperty({ 
    description: 'Nuevo valor del campo cambiado', 
    example: 'Cancelada',
    required: false
  })
  @IsOptional()
  @IsString()
  valorNuevo?: string;

  @ApiProperty({ 
    description: 'ID del usuario que realizó el cambio', 
    example: 1 
  })
  @IsNumber()
  @IsNotEmpty()
  usuarioId: number;
}
