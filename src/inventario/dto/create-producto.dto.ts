import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsEnum, IsBoolean, IsDateString, Min, Max } from 'class-validator';

export enum UnidadMedida {
  ML = 'ml',
  MG = 'mg',
  TABLETAS = 'tabletas',
  CAPSULAS = 'capsulas',
  UNIDADES = 'unidades',
  KG = 'kg',
  G = 'g',
  L = 'l'
}

export class CreateProductoDto {
  @ApiProperty({ 
    description: 'Nombre del producto', 
    example: 'Ivermectina 1% Solución Inyectable' 
  })
  @IsString()
  nombre: string;

  @ApiProperty({ 
    description: 'Descripción detallada del producto', 
    example: 'Antiparasitario interno para perros y gatos. Presentación de 50ml.' 
  })
  @IsString()
  descripcion: string;

  @ApiProperty({ 
    description: 'Código de barras o SKU del producto', 
    example: 'IVER001-50ML',
    required: false
  })
  @IsOptional()
  @IsString()
  codigoBarras?: string;

  @ApiProperty({ 
    description: 'Cantidad actual en stock', 
    example: 25 
  })
  @IsNumber()
  @Min(0)
  stockActual: number;

  @ApiProperty({ 
    description: 'Stock mínimo para alertas', 
    example: 10 
  })
  @IsNumber()
  @Min(0)
  stockMinimo: number;

  @ApiProperty({ 
    description: 'Stock máximo permitido', 
    example: 100,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stockMaximo?: number;

  @ApiProperty({ 
    description: 'Precio de compra por unidad', 
    example: 15.50 
  })
  @IsNumber()
  @Min(0)
  precioCompra: number;

  @ApiProperty({ 
    description: 'Precio de venta por unidad', 
    example: 25.00 
  })
  @IsNumber()
  @Min(0)
  precioVenta: number;

  @ApiProperty({ 
    description: 'Fecha de vencimiento del producto', 
    example: '2024-12-31',
    required: false
  })
  @IsOptional()
  @IsDateString()
  fechaVencimiento?: string;

  @ApiProperty({ 
    description: 'Unidad de medida', 
    example: UnidadMedida.ML,
    enum: UnidadMedida
  })
  @IsEnum(UnidadMedida)
  unidadMedida: UnidadMedida;

  @ApiProperty({ 
    description: 'Lote del producto', 
    example: 'LOT-2024-001',
    required: false
  })
  @IsOptional()
  @IsString()
  lote?: string;

  @ApiProperty({ 
    description: 'Ubicación física en el almacen', 
    example: 'Estantía A-3',
    required: false
  })
  @IsOptional()
  @IsString()
  ubicacion?: string;

  @ApiProperty({ 
    description: 'Indica si el producto está activo', 
    example: true,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ 
    description: 'ID de la categoría del producto', 
    example: 1 
  })
  @IsNumber()
  categoriaId: number;

  @ApiProperty({ 
    description: 'ID de la veterinaria', 
    example: 1 
  })
  @IsNumber()
  veterinariaId: number;
}
