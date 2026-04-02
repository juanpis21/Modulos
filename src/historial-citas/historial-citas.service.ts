import { Injectable, NotFoundException, ConflictException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistorialCita } from './entities/historial-cita.entity';
import { CreateHistorialCitaDto, TipoCambio } from './dto/create-historial-cita.dto';
import { UpdateHistorialCitaDto } from './dto/update-historial-cita.dto';
import { CitasService } from '../citas/citas.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class HistorialCitasService {
  constructor(
    @InjectRepository(HistorialCita)
    private historialCitasRepository: Repository<HistorialCita>,
    @Inject(forwardRef(() => CitasService))
    private citasService: CitasService,
    private usersService: UsersService,
  ) {}

  async create(createHistorialCitaDto: CreateHistorialCitaDto): Promise<HistorialCita> {
    // Verificar si la cita existe
    const cita = await this.citasService.findOne(createHistorialCitaDto.citaId);
    if (!cita) {
      throw new NotFoundException(`Cita with ID ${createHistorialCitaDto.citaId} not found`);
    }

    // Verificar si el usuario existe
    const usuario = await this.usersService.findOne(createHistorialCitaDto.usuarioId);
    if (!usuario) {
      throw new NotFoundException(`Usuario with ID ${createHistorialCitaDto.usuarioId} not found`);
    }

    const historialCita = this.historialCitasRepository.create({
      ...createHistorialCitaDto,
      cita,
      usuario,
    });

    return this.historialCitasRepository.save(historialCita);
  }

  async findAll(): Promise<HistorialCita[]> {
    return this.historialCitasRepository.find({ 
      relations: ['cita', 'usuario'],
      order: { fechaRegistro: 'DESC' }
    });
  }

  async findOne(id: number): Promise<HistorialCita> {
    const historialCita = await this.historialCitasRepository.findOne({
      where: { id },
      relations: ['cita', 'usuario'],
    });

    if (!historialCita) {
      throw new NotFoundException(`HistorialCita with ID ${id} not found`);
    }

    return historialCita;
  }

  async findByCita(citaId: number): Promise<HistorialCita[]> {
    // Verificar si la cita existe
    const cita = await this.citasService.findOne(citaId);
    if (!cita) {
      throw new NotFoundException(`Cita with ID ${citaId} not found`);
    }

    return this.historialCitasRepository.find({
      where: { cita: { id: citaId } },
      relations: ['usuario'],
      order: { fechaRegistro: 'DESC' }
    });
  }

  async findByUsuario(usuarioId: number): Promise<HistorialCita[]> {
    // Verificar si el usuario existe
    const usuario = await this.usersService.findOne(usuarioId);
    if (!usuario) {
      throw new NotFoundException(`Usuario with ID ${usuarioId} not found`);
    }

    return this.historialCitasRepository.find({
      where: { usuario: { id: usuarioId } },
      relations: ['cita'],
      order: { fechaRegistro: 'DESC' }
    });
  }

  async findByTipoCambio(tipoCambio: string): Promise<HistorialCita[]> {
    return this.historialCitasRepository.find({
      where: { tipoCambio },
      relations: ['cita', 'usuario'],
      order: { fechaRegistro: 'DESC' }
    });
  }

  async findByFechaRange(fechaInicio: string, fechaFin: string): Promise<HistorialCita[]> {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    fin.setDate(fin.getDate() + 1); // Incluir el día final completo

    return this.historialCitasRepository
      .createQueryBuilder('historial')
      .leftJoinAndSelect('historial.cita', 'cita')
      .leftJoinAndSelect('historial.usuario', 'usuario')
      .where('historial.fechaRegistro >= :fechaInicio', { fechaInicio: inicio })
      .andWhere('historial.fechaRegistro < :fechaFin', { fechaFin: fin })
      .orderBy('historial.fechaRegistro', 'DESC')
      .getMany();
  }

  async update(id: number, updateHistorialCitaDto: UpdateHistorialCitaDto): Promise<HistorialCita> {
    const historialCita = await this.findOne(id);

    // Actualizar solo los campos proporcionados
    if (updateHistorialCitaDto.tipoCambio !== undefined) {
      historialCita.tipoCambio = updateHistorialCitaDto.tipoCambio;
    }
    if (updateHistorialCitaDto.descripcion !== undefined) {
      historialCita.descripcion = updateHistorialCitaDto.descripcion;
    }
    if (updateHistorialCitaDto.valorAnterior !== undefined) {
      historialCita.valorAnterior = updateHistorialCitaDto.valorAnterior;
    }
    if (updateHistorialCitaDto.valorNuevo !== undefined) {
      historialCita.valorNuevo = updateHistorialCitaDto.valorNuevo;
    }

    return this.historialCitasRepository.save(historialCita);
  }

  async remove(id: number): Promise<void> {
    const historialCita = await this.findOne(id);
    await this.historialCitasRepository.remove(historialCita);
  }

  // Métodos auxiliares para registrar cambios automáticamente
  async registrarCreacionCita(citaId: number, usuarioId: number, descripcion: string): Promise<HistorialCita> {
    return this.create({
      citaId,
      tipoCambio: TipoCambio.CREACION,
      descripcion,
      usuarioId
    });
  }

  async registrarActualizacionCita(citaId: number, usuarioId: number, descripcion: string, valorAnterior?: string, valorNuevo?: string): Promise<HistorialCita> {
    return this.create({
      citaId,
      tipoCambio: TipoCambio.ACTUALIZACION,
      descripcion,
      valorAnterior,
      valorNuevo,
      usuarioId
    });
  }

  async registrarCancelacionCita(citaId: number, usuarioId: number, descripcion: string): Promise<HistorialCita> {
    return this.create({
      citaId,
      tipoCambio: TipoCambio.CANCELACION,
      descripcion,
      valorAnterior: 'Programada',
      valorNuevo: 'Cancelada',
      usuarioId
    });
  }

  async registrarCompletacionCita(citaId: number, usuarioId: number, descripcion: string): Promise<HistorialCita> {
    return this.create({
      citaId,
      tipoCambio: TipoCambio.COMPLETACION,
      descripcion,
      valorAnterior: 'Programada',
      valorNuevo: 'Completada',
      usuarioId
    });
  }
}
