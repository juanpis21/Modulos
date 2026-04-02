import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, Min, Max } from 'class-validator';

export class CreatePetDto {
  @ApiProperty({ 
    description: 'Nombre de la mascota', 
    example: 'Firulais' 
  })
  @IsString()
  name: string;

  @ApiProperty({ 
    description: 'Especie de la mascota', 
    example: 'Perro' 
  })
  @IsString()
  species: string;

  @ApiProperty({ 
    description: 'Raza de la mascota', 
    example: 'Labrador' 
  })
  @IsString()
  breed: string;

  @ApiProperty({ 
    description: 'Edad de la mascota', 
    example: 3 
  })
  @IsNumber()
  @Min(0)
  @Max(50)
  age: number;

  @ApiProperty({ 
    description: 'Género de la mascota', 
    example: 'Macho' 
  })
  @IsString()
  gender: string;

  @ApiProperty({ 
    description: 'Color de la mascota', 
    example: 'Dorado' 
  })
  @IsString()
  color: string;

  @ApiProperty({ 
    description: 'Peso de la mascota en kg', 
    example: 25.5 
  })
  @IsNumber()
  @Min(0.1)
  @Max(200)
  weight: number;

  @ApiProperty({ 
    description: 'Descripción o notas adicionales sobre la mascota', 
    example: 'Mascota muy juguetona y amigable',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    description: 'ID del dueño de la mascota', 
    example: 2,
    required: false
  })
  @IsOptional()
  @IsNumber()
  ownerId?: number;

  @ApiProperty({ 
    description: 'Indica si la mascota está activa en el sistema', 
    example: true,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
