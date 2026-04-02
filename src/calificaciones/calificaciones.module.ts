import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalificacionesController } from './calificaciones.controller';
import { CalificacionesService } from './calificaciones.service';
import { Calificacion } from './entities/calificacion.entity';
import { UsersModule } from '../users/users.module';
import { ServiciosModule } from '../servicios/servicios.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Calificacion]),
    forwardRef(() => UsersModule),
    forwardRef(() => ServiciosModule),
    forwardRef(() => AuthModule)
  ],
  controllers: [CalificacionesController],
  providers: [CalificacionesService],
  exports: [CalificacionesService],
})
export class CalificacionesModule {}
