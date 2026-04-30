import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePublicacionDto {
  @ApiProperty({ 
    description: 'Descripción de la publicación (obligatorio)', 
    example: 'Mi mascota necesita un nuevo hogar...',
    required: true
  })
  @IsString()
  descripcion: string;

  @ApiProperty({ 
    description: 'URL de la imagen de la publicación (opcional)', 
    example: 'https://example.com/imagen.jpg',
    required: false
  })
  @IsOptional()
  @IsString()
  imagen?: string;

  @ApiProperty({ 
    description: 'ID del autor de la publicación (opcional, se asigna automáticamente)', 
    example: 25,
    required: false
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  autorId?: number;
}
