import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, MinLength, MaxLength, IsBoolean, IsArray, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({ 
    description: 'Nombre de usuario', 
    example: 'juanp',
    minLength: 3,
    maxLength: 50
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username: string;

  @ApiProperty({ 
    description: 'Email del usuario', 
    example: 'juan@example.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    description: 'Contraseña', 
    minLength: 6,
    maxLength: 100
  })
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password: string;

  @ApiProperty({ 
    description: 'Nombre completo', 
    example: 'Juan Pérez',
    required: false,
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  fullName?: string;

  @ApiProperty({ 
    description: 'Nombres', 
    example: 'Juan Carlos',
    required: false
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ 
    description: 'Apellidos', 
    example: 'Pérez García',
    required: false
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ 
    description: 'Teléfono', 
    example: '+1234567890',
    required: false,
    maxLength: 20
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiProperty({ 
    description: 'Tipo de documento', 
    example: 'Cédula',
    required: false
  })
  @IsOptional()
  @IsString()
  documentType?: string;

  @ApiProperty({ 
    description: 'Número de documento', 
    example: '12345678',
    required: false
  })
  @IsOptional()
  @IsString()
  documentNumber?: string;

  @ApiProperty({ 
    description: 'Edad', 
    example: 25,
    required: false
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  age?: number;

  @ApiProperty({ 
    description: 'Dirección', 
    example: 'Calle 123 #45-67',
    required: false
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ 
    description: 'Estado del usuario', 
    example: true,
    required: false
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ 
    description: 'ID del rol del usuario', 
    example: 4,
    required: false 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  roleId?: number;

  @ApiProperty({ 
    description: 'Imagen de perfil', 
    required: false 
  })
  @IsOptional()
  @IsString()
  avatar?: string;
}
