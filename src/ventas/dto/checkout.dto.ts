import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CheckoutDto {
  @ApiProperty({ 
    description: 'Notas opcionales para la venta', 
    example: 'Por favor, empacar para regalo.',
    required: false
  })
  @IsOptional()
  @IsString()
  notas?: string;

  // No necesitamos pasar IDs de productos ni total porque 
  // esto se obtiene de manera segura desde la base de datos (del carrito activo).
}
