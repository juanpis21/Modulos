import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmergenciasController } from './emergencias.controller';
import { EmergenciasService } from './emergencias.service';
import { Emergencia } from './entities/emergencia.entity';
import { PetsModule } from '../pets/pets.module';
import { RolesModule } from '../roles/roles.module';
import { VeterinariasModule } from '../veterinarias/veterinarias.module';

@Module({
  imports: [TypeOrmModule.forFeature([Emergencia]), PetsModule, RolesModule, VeterinariasModule],
  controllers: [EmergenciasController],
  providers: [EmergenciasService],
  exports: [EmergenciasService],
})
export class EmergenciasModule {}
