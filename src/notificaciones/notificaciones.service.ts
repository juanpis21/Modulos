import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notificacion, EstadoNotificacion, TipoNotificacion } from './entities/notificacion.entity';
import { CreateNotificacionDto } from './dto/create-notificacion.dto';

@Injectable()
export class NotificacionesService {
  constructor(
    @InjectRepository(Notificacion)
    private notificacionesRepository: Repository<Notificacion>,
  ) {}

  // Permite a otros módulos crear notificaciones fácilmente
  async enviar(createNotificacionDto: CreateNotificacionDto): Promise<Notificacion> {
    const notificacion = this.notificacionesRepository.create({
      ...createNotificacionDto,
      estado: EstadoNotificacion.NO_LEIDO,
    });
    return this.notificacionesRepository.save(notificacion);
  }

  // Método rapido para uso interno (ej: VentasService, CitasService)
  async enviarAlertaRapida(usuarioId: number, mensaje: string, tipo: TipoNotificacion = TipoNotificacion.INFO): Promise<Notificacion> {
    const notificacion = this.notificacionesRepository.create({
      usuarioId,
      mensaje,
      tipo,
      estado: EstadoNotificacion.NO_LEIDO,
    });
    return this.notificacionesRepository.save(notificacion);
  }

  async findByUsuario(usuarioId: number): Promise<Notificacion[]> {
    return this.notificacionesRepository.find({
      where: { usuarioId },
      order: { fecha: 'DESC' },
    });
  }

  async findNoLeidasByUsuario(usuarioId: number): Promise<Notificacion[]> {
    return this.notificacionesRepository.find({
      where: { usuarioId, estado: EstadoNotificacion.NO_LEIDO },
      order: { fecha: 'DESC' },
    });
  }

  async marcarComoLeida(id: number, usuarioId: number): Promise<Notificacion> {
    const notificacion = await this.notificacionesRepository.findOne({
      where: { id, usuarioId }
    });

    if (!notificacion) {
      throw new NotFoundException(`Notificación con ID ${id} no encontrada en tu cuenta`);
    }

    notificacion.estado = EstadoNotificacion.LEIDO;
    return this.notificacionesRepository.save(notificacion);
  }

  async marcarTodasComoLeidas(usuarioId: number): Promise<void> {
    await this.notificacionesRepository.update(
      { usuarioId, estado: EstadoNotificacion.NO_LEIDO },
      { estado: EstadoNotificacion.LEIDO }
    );
  }

  // Solo para admin
  async findAll(): Promise<Notificacion[]> {
    return this.notificacionesRepository.find({
      relations: ['usuario'],
      order: { fecha: 'DESC' }
    });
  }
}
