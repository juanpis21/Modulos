import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, MinLength, MaxLength, IsBoolean, IsArray, IsNumber } from 'class-validator';

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
    description: 'Estado del usuario', 
    example: true,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ 
    description: 'IDs de los roles del usuario', 
    example: [1, 2],
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  roleIds?: number[];
}
