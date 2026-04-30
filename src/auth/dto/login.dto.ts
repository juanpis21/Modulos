import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ 
    description: 'Nombre de usuario', 
    example: 'juanp'
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ 
    description: 'Contraseña', 
    example: 'password123'
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
