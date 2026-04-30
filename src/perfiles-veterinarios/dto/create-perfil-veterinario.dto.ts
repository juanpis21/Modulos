import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, MinLength, MaxLength, IsEmail } from 'class-validator';

export class CreatePerfilVeterinarioDto {
  @ApiProperty({ 
    description: 'Especialidad del veterinario', 
    example: 'Medicina General Canina' 
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  especialidad: string;

  @ApiProperty({ 
    description: 'Número de matrícula profesional', 
    example: 'MV-2023-1234' 
  })
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  matricula: string;

  @ApiProperty({ 
    description: 'Años de experiencia', 
    example: 5,
    required: false
  })
  @IsOptional()
  @IsNumber()
  aniosExperiencia?: number;

  @ApiProperty({ 
    description: 'Universidad de egreso', 
    example: 'Universidad Nacional de Veterinaria',
    required: false
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  universidad?: string;

  @ApiProperty({ 
    description: 'Teléfono de contacto profesional', 
    example: '+1234567890',
    required: false
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefonoProfesional?: string;

  @ApiProperty({ 
    description: 'Email profesional', 
    example: 'dr.veterinario@clinica.com',
    required: false
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  emailProfesional?: string;

  @ApiProperty({ 
    description: 'Biografía o descripción profesional', 
    example: 'Veterinario con especialización en medicina canina y felina',
    required: false
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  biografia?: string;

  @ApiProperty({ 
    description: 'ID del usuario asociado', 
    example: 1 
  })
  @IsNumber()
  usuarioId: number;

  @ApiProperty({ 
    description: 'ID de la veterinaria principal', 
    example: 1,
    required: false
  })
  @IsOptional()
  @IsNumber()
  veterinariaPrincipalId?: number;

  @ApiProperty({ 
    description: 'Indica si el perfil veterinario está activo en el sistema', 
    example: true,
    required: false
  })
  @IsOptional()
  isActive?: boolean;
}
