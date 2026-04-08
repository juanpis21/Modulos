import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EstadoReporte } from '../entities/reporte-maltrato.entity';

export class UpdateReporteMaltratoDto {
  @ApiProperty({ enum: EstadoReporte, description: 'Nuevo estado del reporte', required: false })
  @IsEnum(EstadoReporte)
  @IsOptional()
  estado?: EstadoReporte;

  @ApiProperty({ description: 'Posibilidad de añadir más información a la descripción', required: false })
  @IsString()
  @IsOptional()
  descripcion?: string;
}
