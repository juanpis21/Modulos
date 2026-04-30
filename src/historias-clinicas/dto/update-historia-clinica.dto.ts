import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateHistoriaClinicaDto } from './create-historia-clinica.dto';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateHistoriaClinicaDto extends PartialType(CreateHistoriaClinicaDto) {
  @ApiProperty({ description: 'Indica si se quiere sobreescribir el texto o concatenarle nueva info. Por defecto es falso.', default: false })
  @IsBoolean()
  @IsOptional()
  appendMode?: boolean;
}
