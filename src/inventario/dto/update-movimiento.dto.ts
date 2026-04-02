import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { TipoMovimiento } from './create-movimiento.dto';

export class UpdateMovimientoDto {
  @ApiProperty({ 
    description: 'Tipo de movimiento', 
    example: TipoMovimiento.ENTRADA,
    enum: TipoMovimiento,
    required: false
  })
  @IsOptional()
  @IsEnum(TipoMovimiento)
  tipoMovimiento?: TipoMovimiento;

  @ApiProperty({ 
    description: 'Cantidad movida', 
    example: 10,
    required: false
  })
  @IsOptional()
  @IsString()
  cantidad?: string;

  @ApiProperty({ 
    description: 'Motivo del movimiento', 
    example: 'Compra a proveedor',
    required: false
  })
  @IsOptional()
  @IsString()
  motivo?: string;

  @ApiProperty({ 
    description: 'Número de documento o referencia', 
    example: 'FACT-001234',
    required: false
  })
  @IsOptional()
  @IsString()
  documentoReferencia?: string;

  @ApiProperty({ 
    description: 'Notas adicionales del movimiento', 
    example: 'Medicamento recibido con fecha de vencimiento 2024-12-31',
    required: false
  })
  @IsOptional()
  @IsString()
  notas?: string;
}
