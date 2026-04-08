import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateEventoDto {
  @ApiProperty({ example: 'Vacunación Antirrábica Gratuita' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  titulo: string;

  @ApiProperty({ example: 'Trae a tu mascota y su carnet.' })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiProperty({ example: 'https://imgur.com/example.png', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  imagen?: string;

  @ApiProperty({ example: '2026-10-01' })
  @IsDateString()
  @IsNotEmpty()
  fechaInicio: string;

  @ApiProperty({ example: '2026-10-05' })
  @IsDateString()
  @IsNotEmpty()
  fechaFin: string;

  @ApiProperty({ description: 'ID de la veterinaria responsable', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  veterinariaId: number;
}
