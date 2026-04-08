import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReporteMaltratoDto {
  @ApiProperty({ example: 'Encontré a un perrito amarrado bajo la lluvia en la esquina sur del parque...', description: 'Descripción detallada de la denuncia' })
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiProperty({ example: 5, description: 'ID de la Mascota asociada, dejar en blanco si el animal es desconocido', required: false })
  @IsNumber()
  @IsOptional()
  mascotaId?: number;
}
