import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoriasClinicasService } from './historias-clinicas.service';
import { HistoriasClinicasController } from './historias-clinicas.controller';
import { HistoriaClinica } from './entities/historia-clinica.entity';
import { PetsModule } from '../pets/pets.module';
import { RolesModule } from '../roles/roles.module';
import { VeterinariasModule } from '../veterinarias/veterinarias.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HistoriaClinica]),
    PetsModule,
    RolesModule,
    VeterinariasModule,
    UsersModule
  ],
  controllers: [HistoriasClinicasController],
  providers: [HistoriasClinicasService],
  exports: [HistoriasClinicasService]
})
export class HistoriasClinicasModule {}
