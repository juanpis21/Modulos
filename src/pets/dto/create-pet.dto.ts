import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePetDto {
  @ApiProperty({ 
    description: 'Nombre de la mascota (obligatorio)', 
    example: 'Firulais',
    required: true
  })
  @IsString()
  name: string;

  @ApiProperty({ 
    description: 'Especie de la mascota: Perro, Gato, Ave, Pez, etc. (obligatorio)', 
    example: 'Perro',
    required: true
  })
  @IsString()
  species: string;

  @ApiProperty({ 
    description: 'Raza de la mascota (obligatorio)', 
    example: 'Labrador',
    required: true
  })
  @IsString()
  breed: string;

  @ApiProperty({ 
    description: 'Edad de la mascota en años (0-50, obligatorio)', 
    example: 3,
    required: true,
    minimum: 0,
    maximum: 50
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(50)
  age: number;

  @ApiProperty({ 
    description: 'Género: M (Macho) o F (Hembra) (obligatorio)', 
    example: 'M',
    required: true,
    enum: ['M', 'F']
  })
  @IsString()
  gender: string;

  @ApiProperty({ 
    description: 'Color de la mascota (obligatorio)', 
    example: 'Dorado',
    required: true
  })
  @IsString()
  color: string;

  @ApiProperty({ 
    description: 'Peso de la mascota en kg (0.1-200, obligatorio)', 
    example: 25.5,
    required: true,
    minimum: 0.1,
    maximum: 200
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0.1)
  @Max(200)
  weight: number;

  @ApiProperty({
    description: 'Descripción o notas adicionales sobre la mascota (opcional)',
    example: 'Mascota muy juguetona y amigable',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'URL o base64 de la foto de la mascota (opcional)',
    example: 'https://example.com/mascota.jpg',
    required: false
  })
  @IsOptional()
  @IsString()
  foto?: string;

  @ApiProperty({ 
    description: 'ID del dueño de la mascota (opcional, se asigna automáticamente si no se proporciona)', 
    example: 2,
    required: false
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  ownerId?: number;

  @ApiProperty({ 
    description: 'Indica si la mascota está activa en el sistema (opcional, por defecto true)', 
    example: true,
    required: false,
    default: true
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;
}
