import { Injectable, NotFoundException, ConflictException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
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
    console.log(`[DEBUG] Buscando historial para citaId: ${citaId}`);
    
    try {
      const query = this.historialCitasRepository
        .createQueryBuilder('historial')
        .leftJoinAndSelect('historial.usuario', 'usuario')
        .leftJoinAndSelect('historial.cita', 'cita')
        .where('historial.citaId = :citaId', { citaId }) // Uso directo de la columna
        .orWhere('cita.id = :citaId', { citaId })       // Por si acaso
        .orderBy('historial.fechaRegistro', 'DESC');

      const registros = await query.getMany();
      console.log(`[DEBUG] Registros encontrados: ${registros.length}`);
      
      return registros;
    } catch (error) {
      console.error('[DEBUG] Error en findByCita:', error);
      throw error;
    }
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
    const inicioQuery = new Date(fechaInicio);
    const finQuery = new Date(fechaFin);

    // Validar si las fechas son válidas
    if (isNaN(inicioQuery.getTime()) || isNaN(finQuery.getTime())) {
      throw new Error('Formato de fecha inválido. Use YYYY-MM-DD');
    }

    // Ajustar para cubrir los días completos
    const inicio = new Date(inicioQuery);
    inicio.setUTCHours(0, 0, 0, 0);

    const fin = new Date(finQuery);
    fin.setUTCHours(23, 59, 59, 999);

    console.log(`[DEBUG] Buscando historial entre ${inicio.toISOString()} y ${fin.toISOString()}`);

    try {
      console.log(`[DEBUG] Buscando con Between entre ${inicio.toISOString()} y ${fin.toISOString()}`);
      
      return this.historialCitasRepository.find({
        where: {
          fechaRegistro: Between(inicio, fin)
        },
        relations: ['cita', 'usuario'],
        order: { fechaRegistro: 'DESC' }
      });
    } catch (error) {
      console.error('[DEBUG] Error en findByFechaRange:', error);
      throw error;
    }
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
