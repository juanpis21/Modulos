import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ 
    description: 'Nombre del rol', 
    example: 'admin',
    minLength: 2,
    maxLength: 50
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiProperty({ 
    description: 'Descripción del rol', 
    example: 'Administrador del sistema con acceso completo',
    required: false,
    maxLength: 200
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;
}
