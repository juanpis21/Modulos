import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SolicitarRecuperacionDto {
  @ApiProperty({ example: 'usuario@ejemplo.com', description: 'Correo del usuario que olvidó su clave' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
