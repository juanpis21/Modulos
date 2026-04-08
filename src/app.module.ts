import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PetsModule } from './pets/pets.module';
import { VeterinariasModule } from './veterinarias/veterinarias.module';
import { CitasModule } from './citas/citas.module';
import { HistorialCitasModule } from './historial-citas/historial-citas.module';
import { PerfilesVeterinariosModule } from './perfiles-veterinarios/perfiles-veterinarios.module';
import { EmergenciasModule } from './emergencias/emergencias.module';
import { AdopcionesModule } from './adopciones/adopciones.module';
import { ProductosModule } from './productos/productos.module';
import { CategoriasModule } from './categorias/categorias.module';
import { MovimientosModule } from './movimientos/movimientos.module';
import { ProveedoresModule } from './proveedores/proveedores.module';
import { StockModule } from './stock/stock.module';
import { ServiciosModule } from './servicios/servicios.module';
import { CalificacionesModule } from './calificaciones/calificaciones.module';
import { CarritoModule } from './carrito/carrito.module';
import { User } from './users/entities/user.entity';
import { Role } from './roles/entities/role.entity';
import { Pet } from './pets/entities/pet.entity';
import { Veterinaria } from './veterinarias/entities/veterinaria.entity';
import { Cita } from './citas/entities/cita.entity';
import { PerfilVeterinario } from './perfiles-veterinarios/entities/perfil-veterinario.entity';
import { Emergencia } from './emergencias/entities/emergencia.entity';
import { HistorialCita } from './historial-citas/entities/historial-cita.entity';
import { Adopcion } from './adopciones/entities/adopcion.entity';
import { Producto } from './productos/entities/producto.entity';
import { Categoria } from './categorias/entities/categoria.entity';
import { MovimientoInventario } from './movimientos/entities/movimiento-inventario.entity';
import { Proveedor } from './proveedores/entities/proveedor.entity';
import { Servicio } from './servicios/entities/servicio.entity';
import { Calificacion } from './calificaciones/entities/calificacion.entity';
import { Carrito } from './carrito/entities/carrito.entity';
import { CarritoProducto } from './carrito/entities/carrito-producto.entity';
import { VentasModule } from './ventas/ventas.module';
import { Venta } from './ventas/entities/venta.entity';
import { DetalleVenta } from './ventas/entities/detalle-venta.entity';
import { NotificacionesModule } from './notificaciones/notificaciones.module';
import { Notificacion } from './notificaciones/entities/notificacion.entity';
import { EventosModule } from './eventos/eventos.module';
import { Evento } from './eventos/entities/evento.entity';
import { HistoriasClinicasModule } from './historias-clinicas/historias-clinicas.module';
import { HistoriaClinica } from './historias-clinicas/entities/historia-clinica.entity';
import { ReportesMaltratoModule } from './reportes-maltrato/reportes-maltrato.module';
import { ReporteMaltrato } from './reportes-maltrato/entities/reporte-maltrato.entity';
import { TokenRecuperacionModule } from './token-recuperacion/token-recuperacion.module';
import { TokenRecuperacion } from './token-recuperacion/entities/token-recuperacion.entity';
import { MailerModule } from '@nestjs-modules/mailer';
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
      entities: [User, Role, Pet, Veterinaria, Cita, PerfilVeterinario, Emergencia, HistorialCita, Adopcion, Producto, Categoria, MovimientoInventario, Proveedor, Servicio, Calificacion, Carrito, CarritoProducto, Venta, DetalleVenta, Notificacion, Evento, HistoriaClinica, ReporteMaltrato, TokenRecuperacion],
      synchronize: true,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false, // true para port 465
          auth: {
            user: configService.get('SMTP_USER'),
            pass: configService.get('SMTP_PASS'),
          },
        },
        defaults: {
          from: '"Soporte ClinicPet" <' + configService.get('SMTP_USER') + '>',
        },
      }),
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    PetsModule,
    VeterinariasModule,
    CitasModule,
    HistorialCitasModule,
    PerfilesVeterinariosModule,
    EmergenciasModule,
    AdopcionesModule,
    ProductosModule,
    CategoriasModule,
    MovimientosModule,
    ProveedoresModule,
    StockModule,
    ServiciosModule,
    CalificacionesModule,
    CarritoModule,
    VentasModule,
    NotificacionesModule,
    EventosModule,
    HistoriasClinicasModule,
    ReportesMaltratoModule,
    TokenRecuperacionModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
