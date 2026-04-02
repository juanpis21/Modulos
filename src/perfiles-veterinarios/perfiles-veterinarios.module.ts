import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerfilesVeterinariosController } from './perfiles-veterinarios.controller';
import { PerfilesVeterinariosService } from './perfiles-veterinarios.service';
import { PerfilVeterinario } from './entities/perfil-veterinario.entity';
import { UsersModule } from '../users/users.module';
import { VeterinariasModule } from '../veterinarias/veterinarias.module';

@Module({
  imports: [TypeOrmModule.forFeature([PerfilVeterinario]), UsersModule, VeterinariasModule],
  controllers: [PerfilesVeterinariosController],
  providers: [PerfilesVeterinariosService],
  exports: [PerfilesVeterinariosService],
})
export class PerfilesVeterinariosModule {}
