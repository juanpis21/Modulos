import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional } from 'class-validator';
import { TipoCambio } from './create-historial-cita.dto';

export class UpdateHistorialCitaDto {
  @ApiProperty({ 
    description: 'Tipo de cambio realizado', 
    enum: TipoCambio,
    example: TipoCambio.ACTUALIZACION,
    required: false
  })
  @IsOptional()
  @IsEnum(TipoCambio)
  tipoCambio?: TipoCambio;

  @ApiProperty({ 
    description: 'Descripción del cambio realizado', 
    example: 'Se actualizó la fecha de la cita',
    required: false
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ 
    description: 'Valor anterior del campo cambiado', 
    example: '2026-03-20T10:30:00.000Z',
    required: false
  })
  @IsOptional()
  @IsString()
  valorAnterior?: string;

  @ApiProperty({ 
    description: 'Nuevo valor del campo cambiado', 
    example: '2026-03-21T14:00:00.000Z',
    required: false
  })
  @IsOptional()
  @IsString()
  valorNuevo?: string;
}
