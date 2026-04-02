import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PetsModule } from './pets/pets.module';
import { VeterinariasModule } from './veterinarias/veterinarias.module';
import { CitasModule } from './citas/citas.module';
import { PerfilesVeterinariosModule } from './perfiles-veterinarios/perfiles-veterinarios.module';
import { EmergenciasModule } from './emergencias/emergencias.module';
import { HistorialCitasModule } from './historial-citas/historial-citas.module';
import { AdopcionesModule } from './adopciones/adopciones.module';
import { User } from './users/entities/user.entity';
import { Role } from './roles/entities/role.entity';
import { Pet } from './pets/entities/pet.entity';
import { Veterinaria } from './veterinarias/entities/veterinaria.entity';
import { Cita } from './citas/entities/cita.entity';
import { PerfilVeterinario } from './perfiles-veterinarios/entities/perfil-veterinario.entity';
import { Emergencia } from './emergencias/entities/emergencia.entity';
import { HistorialCita } from './historial-citas/entities/historial-cita.entity';
import { Adopcion } from './adopciones/entities/adopcion.entity';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Role, Pet, Veterinaria, Cita, PerfilVeterinario, Emergencia, HistorialCita, Adopcion],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    PetsModule,
    VeterinariasModule,
    CitasModule,
    PerfilesVeterinariosModule,
    EmergenciasModule,
    AdopcionesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
