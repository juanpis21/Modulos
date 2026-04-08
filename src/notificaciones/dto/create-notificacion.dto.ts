import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { TipoNotificacion } from '../entities/notificacion.entity';

export class CreateNotificacionDto {
  @ApiProperty({ description: 'ID del usuario al que va dirigida', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  usuarioId: number;

  @ApiProperty({ description: 'Mensaje de la notificación', example: 'Recordatorio: Mañana es la cita de tu mascota.' })
  @IsString()
  @IsNotEmpty()
  mensaje: string;

  @ApiProperty({ description: 'Nivel o tipo', enum: TipoNotificacion })
  @IsEnum(TipoNotificacion)
  @IsNotEmpty()
  tipo: TipoNotificacion;
}
