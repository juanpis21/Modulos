import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCantidadDto {
  @ApiProperty({ 
    description: 'Nueva cantidad del producto en el carrito', 
    example: 2 
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @IsPositive({ message: 'La cantidad debe ser un número positivo' })
  @Min(1, { message: 'La cantidad mínima es 1' })
  cantidad: number;
}
