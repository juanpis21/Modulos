import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean, IsUrl, Min, Max } from 'class-validator';
import { TipoServicio } from './create-servicio.dto';

export class UpdateServicioDto {
  @ApiProperty({ 
    description: 'Nombre del servicio', 
    example: 'Consulta General',
    required: false
  })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiProperty({ 
    description: 'Descripción detallada del servicio', 
    example: 'Consulta veterinaria general para revisión de salud de mascotas',
    required: false
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ 
    description: 'Precio base del servicio', 
    example: 25000.00,
    required: false
  })
  @IsOptional()
  @IsNumber()
  precioBase?: number;

  @ApiProperty({ 
    description: 'Duración estimada en minutos', 
    example: 30,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(5)
  @Max(480)
  duracionMinutos?: number;

  @ApiProperty({ 
    description: 'Tipo de servicio', 
    example: TipoServicio.CONSULTA,
    enum: TipoServicio,
    required: false
  })
  @IsOptional()
  @IsEnum(TipoServicio)
  tipoServicio?: TipoServicio;

  @ApiProperty({ 
    description: 'Requiere cita previa', 
    example: true,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  requiereCita?: boolean;

  @ApiProperty({ 
    description: 'Estado del servicio', 
    example: true,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ 
    description: 'ID de la veterinaria', 
    example: 1,
    required: false
  })
  @IsOptional()
  @IsNumber()
  veterinariaId?: number;

  @ApiProperty({ 
    description: 'URL de imagen del servicio', 
    example: 'https://example.com/images/consulta-general.jpg',
    required: false
  })
  @IsOptional()
  @IsUrl()
  imagen?: string;

  @ApiProperty({ 
    description: 'Etiquetas para búsqueda', 
    example: 'consulta,general,revision,salud',
    required: false
  })
  @IsOptional()
  @IsString()
  etiquetas?: string;
}
