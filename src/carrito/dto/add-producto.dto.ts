import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, Min, Max } from 'class-validator';

export class AddProductoDto {
  @ApiProperty({ 
    description: 'ID del producto a agregar', 
    example: 1 
  })
  @IsNumber()
  @IsPositive()
  productoId: number;

  @ApiProperty({ 
    description: 'Cantidad del producto', 
    example: 2,
    minimum: 1,
    maximum: 100
  })
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(100)
  cantidad: number;
}
