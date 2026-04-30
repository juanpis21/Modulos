import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';

export enum TipoMovimiento {
  ENTRADA = 'ENTRADA',
  SALIDA = 'SALIDA',
  AJUSTE = 'AJUSTE',
  DEVOLUCION = 'DEVOLUCION'
}

export class CreateMovimientoDto {
  @ApiProperty({ 
    description: 'ID del producto', 
    example: 1 
  })
  @IsNumber()
  productoId: number;

  @ApiProperty({ 
    description: 'Tipo de movimiento', 
    example: TipoMovimiento.ENTRADA,
    enum: TipoMovimiento
  })
  @IsEnum(TipoMovimiento)
  tipoMovimiento: TipoMovimiento;

  @ApiProperty({ 
    description: 'Cantidad movida', 
    example: 10 
  })
  @IsNumber()
  cantidad: number;

  @ApiProperty({ 
    description: 'Motivo del movimiento', 
    example: 'Compra a proveedor' 
  })
  @IsString()
  motivo: string;

  @ApiProperty({ 
    description: 'Número de documento o referencia', 
    example: 'FACT-001234',
    required: false
  })
  @IsOptional()
  @IsString()
  documentoReferencia?: string;

  @ApiProperty({ 
    description: 'ID del usuario que realiza el movimiento', 
    example: 1 
  })
  @IsNumber()
  usuarioId: number;

  @ApiProperty({ 
    description: 'Notas adicionales del movimiento', 
    example: 'Medicamento recibido con fecha de vencimiento 2024-12-31',
    required: false
  })
  @IsOptional()
  @IsString()
  notas?: string;
}
