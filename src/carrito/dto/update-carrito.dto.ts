import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { EstadoCarrito } from '../entities/carrito.entity';

export class UpdateCarritoDto {
  @ApiProperty({ 
    description: 'Estado del carrito', 
    example: 'COMPRADO',
    enum: EstadoCarrito,
    required: false
  })
  @IsOptional()
  @IsEnum(EstadoCarrito)
  estado?: EstadoCarrito;
}
