import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventosService } from './eventos.service';
import { EventosController } from './eventos.controller';
import { Evento } from './entities/evento.entity';
import { VeterinariasModule } from '../veterinarias/veterinarias.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Evento]),
    VeterinariasModule
  ],
  controllers: [EventosController],
  providers: [EventosService],
})
export class EventosModule {}
