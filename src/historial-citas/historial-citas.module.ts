import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialCitasController } from './historial-citas.controller';
import { HistorialCitasService } from './historial-citas.service';
import { HistorialCita } from './entities/historial-cita.entity';
import { CitasModule } from '../citas/citas.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HistorialCita]),
    forwardRef(() => CitasModule),
    UsersModule
  ],
  controllers: [HistorialCitasController],
  providers: [HistorialCitasService],
  exports: [HistorialCitasService],
})
export class HistorialCitasModule {}
