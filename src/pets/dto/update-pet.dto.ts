import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePetDto {
  @ApiProperty({ 
    description: 'Nombre de la mascota', 
    example: 'Firulais',
    required: false
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ 
    description: 'Especie de la mascota', 
    example: 'Perro',
    required: false
  })
  @IsOptional()
  @IsString()
  species?: string;

  @ApiProperty({ 
    description: 'Raza de la mascota', 
    example: 'Labrador',
    required: false
  })
  @IsOptional()
  @IsString()
  breed?: string;

  @ApiProperty({ 
    description: 'Edad de la mascota', 
    example: 3,
    required: false
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(50)
  age?: number;

  @ApiProperty({ 
    description: 'Género de la mascota', 
    example: 'Macho',
    required: false
  })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ 
    description: 'Color de la mascota', 
    example: 'Dorado',
    required: false
  })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({ 
    description: 'Peso de la mascota en kg', 
    example: 25.5,
    required: false
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0.1)
  @Max(200)
  weight?: number;

  @ApiProperty({ 
    description: 'Descripción o notas adicionales sobre la mascota', 
    example: 'Mascota muy juguetona y amigable',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'URL o base64 de la foto de la mascota',
    example: 'https://example.com/mascota.jpg',
    required: false
  })
  @IsOptional()
  @IsString()
  foto?: string;

  @ApiProperty({ 
    description: 'ID del dueño de la mascota', 
    example: 2,
    required: false
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  ownerId?: number;

  @ApiProperty({ 
    description: 'Indica si la mascota está activa en el sistema', 
    example: true,
    required: false
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;
}
