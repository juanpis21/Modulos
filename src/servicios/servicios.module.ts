import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiciosController } from './servicios.controller';
import { ServiciosService } from './servicios.service';
import { Servicio } from './entities/servicio.entity';
import { VeterinariasModule } from '../veterinarias/veterinarias.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Servicio]),
    forwardRef(() => VeterinariasModule)
  ],
  controllers: [ServiciosController],
  providers: [ServiciosService],
  exports: [ServiciosService],
})
export class ServiciosModule {}
