import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateProveedorDto {
  @ApiProperty({ 
    description: 'Nombre del proveedor', 
    example: 'Laboratorios Bayer S.A.' 
  })
  @IsString()
  nombre: string;

  @ApiProperty({ 
    description: 'RUT o identificación fiscal del proveedor', 
    example: '76.123.456-7' 
  })
  @IsString()
  rut: string;

  @ApiProperty({ 
    description: 'Nombre de contacto', 
    example: 'Juan Pérez',
    required: false
  })
  @IsOptional()
  @IsString()
  contacto?: string;

  @ApiProperty({ 
    description: 'Teléfono del proveedor', 
    example: '+56 2 23456789',
    required: false
  })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiProperty({ 
    description: 'Email del proveedor', 
    example: 'contacto@bayer.cl',
    required: false
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ 
    description: 'Dirección del proveedor', 
    example: 'Av. Principal #1234, Santiago',
    required: false
  })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiProperty({ 
    description: 'Ciudad del proveedor', 
    example: 'Santiago',
    required: false
  })
  @IsOptional()
  @IsString()
  ciudad?: string;

  @ApiProperty({ 
    description: 'País del proveedor', 
    example: 'Chile',
    required: false
  })
  @IsOptional()
  @IsString()
  pais?: string;

  @ApiProperty({ 
    description: 'Condiciones de pago', 
    example: '30 días',
    required: false
  })
  @IsOptional()
  @IsString()
  condicionesPago?: string;

  @ApiProperty({ 
    description: 'Tiempo de entrega en días', 
    example: 5,
    required: false
  })
  @IsOptional()
  @IsNumber()
  tiempoEntregaDias?: number;

  @ApiProperty({ 
    description: 'Notas adicionales del proveedor', 
    example: 'Proveedor principal de antiparasitarios',
    required: false
  })
  @IsOptional()
  @IsString()
  notas?: string;

  @ApiProperty({ 
    description: 'Indica si el proveedor está activo', 
    example: true,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
