import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificacionesService } from './notificaciones.service';
import { NotificacionesController } from './notificaciones.controller';
import { Notificacion } from './entities/notificacion.entity';

// Convertimos este módulo en Global para que VentasService, CitasService, etc., 
// puedan enviar notificaciones sin tener que estar importando el módulo constantemente.
@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Notificacion])],
  controllers: [NotificacionesController],
  providers: [NotificacionesService],
  exports: [NotificacionesService]
})
export class NotificacionesModule {}
