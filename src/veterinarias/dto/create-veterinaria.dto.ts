import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsEmail, MinLength, MaxLength } from 'class-validator';

export class CreateVeterinariaDto {
  @ApiProperty({ 
    description: 'Nombre de la veterinaria', 
    example: 'Clinica Veterinaria San Francisco' 
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ 
    description: 'Dirección de la veterinaria', 
    example: 'Calle Principal #123, Santiago' 
  })
  @IsString()
  @MinLength(5)
  @MaxLength(500)
  direccion: string;

  @ApiProperty({ 
    description: 'Teléfono de contacto', 
    example: '+56 2 23456789' 
  })
  @IsString()
  @MinLength(9)
  @MaxLength(20)
  telefono: string;

  @ApiProperty({ 
    description: 'Email de contacto', 
    example: 'contacto@clinicavetsanfrancisco.cl' 
  })
  @IsEmail()
  @MaxLength(100)
  email: string;

  @ApiProperty({ 
    description: 'RUT de la veterinaria', 
    example: '76.123.456-7' 
  })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  rut: string;

  @ApiProperty({ 
    description: 'Descripción de la veterinaria', 
    example: 'Clínica veterinaria con más de 10 años de experiencia, especializada en atención de mascotas pequeñas y grandes.',
    required: false
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  descripcion?: string;

  @ApiProperty({ 
    description: 'Indica si la veterinaria está activa en el sistema', 
    example: true,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
