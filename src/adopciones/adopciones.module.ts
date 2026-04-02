import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdopcionesController } from './adopciones.controller';
import { AdopcionesService } from './adopciones.service';
import { Adopcion } from './entities/adopcion.entity';
import { PetsModule } from '../pets/pets.module';
import { UsersModule } from '../users/users.module';
import { VeterinariasModule } from '../veterinarias/veterinarias.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Adopcion]),
    PetsModule,
    UsersModule,
    VeterinariasModule
  ],
  controllers: [AdopcionesController],
  providers: [AdopcionesService],
  exports: [AdopcionesService],
})
export class AdopcionesModule {}
