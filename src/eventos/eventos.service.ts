import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Evento } from './entities/evento.entity';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { VeterinariasService } from '../veterinarias/veterinarias.service';

@Injectable()
export class EventosService {
  constructor(
    @InjectRepository(Evento)
    private eventosRepository: Repository<Evento>,
    private veterinariasService: VeterinariasService,
  ) {}

  async create(createEventoDto: CreateEventoDto): Promise<Evento> {
    const { fechaInicio, fechaFin, veterinariaId } = createEventoDto;

    // Validación de fechas
    if (new Date(fechaFin) < new Date(fechaInicio)) {
      throw new BadRequestException('La fecha de fin no puede ser anterior a la fecha de inicio.');
    }

    // Verificar que veterinaria existe (VeterinariasService tirará un error 404 si no existe)
    await this.veterinariasService.findOne(veterinariaId);

    const evento = this.eventosRepository.create(createEventoDto);
    return this.eventosRepository.save(evento);
  }

  async findAll(): Promise<Evento[]> {
    return this.eventosRepository.find({
      relations: ['veterinaria'],
      order: { fechaInicio: 'ASC' }
    });
  }

  async findActive(): Promise<Evento[]> {
    // Filtramos para retornar eventos que aún no han terminado
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Inicio del día

    return this.eventosRepository.find({
      where: { fechaFin: MoreThanOrEqual(hoy) },
      relations: ['veterinaria'],
      order: { fechaInicio: 'ASC' }
    });
  }

  async findOne(id: number): Promise<Evento> {
    const evento = await this.eventosRepository.findOne({
      where: { id },
      relations: ['veterinaria']
    });

    if (!evento) {
      throw new NotFoundException(`El evento con ID ${id} no existe.`);
    }
    return evento;
  }

  async findByVeterinaria(veterinariaId: number): Promise<Evento[]> {
    return this.eventosRepository.find({
      where: { veterinariaId },
      relations: ['veterinaria'],
      order: { fechaInicio: 'DESC' }
    });
  }

  async update(id: number, updateEventoDto: UpdateEventoDto): Promise<Evento> {
    const evento = await this.findOne(id);
    
    // Si envían fechas nuevas, validar la congruencia lógica entera
    const fInicio = updateEventoDto.fechaInicio ? new Date(updateEventoDto.fechaInicio) : new Date(evento.fechaInicio);
    const fFin = updateEventoDto.fechaFin ? new Date(updateEventoDto.fechaFin) : new Date(evento.fechaFin);

    if (fFin < fInicio) {
      throw new BadRequestException('La fecha de cierre no puede ser anterior a la de apertura de la campaña.');
    }

    if (updateEventoDto.veterinariaId && updateEventoDto.veterinariaId !== evento.veterinariaId) {
      await this.veterinariasService.findOne(updateEventoDto.veterinariaId);
    }

    Object.assign(evento, updateEventoDto);
    return this.eventosRepository.save(evento);
  }

  async remove(id: number): Promise<void> {
    const evento = await this.findOne(id);
    // Para simplificar ya que Eventos no suele estar amarrado fuertemente a historiales críticos:
    await this.eventosRepository.delete(evento.id);
  }
}
