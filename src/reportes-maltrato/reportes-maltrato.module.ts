import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportesMaltratoService } from './reportes-maltrato.service';
import { ReportesMaltratoController } from './reportes-maltrato.controller';
import { ReporteMaltrato } from './entities/reporte-maltrato.entity';
import { PetsModule } from '../pets/pets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReporteMaltrato]),
    PetsModule
  ],
  controllers: [ReportesMaltratoController],
  providers: [ReportesMaltratoService],
})
export class ReportesMaltratoModule {}
