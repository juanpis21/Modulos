import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { EstadoCarrito } from '../entities/carrito.entity';

export class CreateCarritoDto {
  @ApiProperty({ 
    description: 'Estado inicial del carrito', 
    example: 'ACTIVO',
    enum: EstadoCarrito,
    required: false
  })
  @IsOptional()
  @IsEnum(EstadoCarrito)
  estado?: EstadoCarrito;
}
