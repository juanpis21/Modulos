import { Injectable, NotFoundException, ConflictException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Calificacion } from './entities/calificacion.entity';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { UpdateCalificacionDto } from './dto/update-calificacion.dto';
import { UsersService } from '../users/users.service';
import { ServiciosService } from '../servicios/servicios.service';

@Injectable()
export class CalificacionesService {
  constructor(
    @InjectRepository(Calificacion)
    private calificacionesRepository: Repository<Calificacion>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    @Inject(forwardRef(() => ServiciosService))
    private serviciosService: ServiciosService,
  ) {}

  async create(usuarioId: number, createCalificacionDto: CreateCalificacionDto): Promise<Calificacion> {
    const { servicioId, veterinarioId } = createCalificacionDto;

    // 1. Verificar que el servicio existe
    const servicio = await this.serviciosService.findOne(servicioId);

    // 2. Verificar que el usuario existe
    await this.usersService.findOne(usuarioId);

    // 3. Verificar que el veterinario existe si se especifica
    if (veterinarioId) {
      await this.usersService.findOne(veterinarioId);
    }

    // 4. Verificar duplicados de forma robusta
    // Usamos una búsqueda explícita por ambos IDs para evitar conflictos
    const existingCalificacion = await this.calificacionesRepository.findOne({
      where: { 
        usuarioId: usuarioId, 
        servicioId: servicioId 
      }
    });

    if (existingCalificacion) {
      throw new ConflictException(`El usuario ${usuarioId} ya ha calificado el servicio ${servicioId}`);
    }

    // 5. Crear la calificación vinculando las relaciones de forma explícita
    console.log('[DEBUG] Datos recibidos en DTO:', JSON.stringify(createCalificacionDto));
    console.log('[DEBUG] Puntuación recibida:', createCalificacionDto.puntuacion);

    const calificacion = this.calificacionesRepository.create();
    calificacion.puntuacion = createCalificacionDto.puntuacion;
    calificacion.comentario = createCalificacionDto.comentario;
    calificacion.usuarioId = usuarioId;
    calificacion.servicioId = servicioId;
    calificacion.veterinarioId = veterinarioId;
    calificacion.estado = createCalificacionDto.estado || 'APROBADA';

    console.log('[DEBUG] Objeto Calificacion antes de guardar:', JSON.stringify(calificacion));

    return this.calificacionesRepository.save(calificacion);
  }

  async findAll(): Promise<Calificacion[]> {
    return this.calificacionesRepository.find({
      relations: ['usuario', 'servicio', 'veterinario'],
      where: { estado: 'APROBADA' },
      order: { fecha: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Calificacion> {
    const calificacion = await this.calificacionesRepository.findOne({
      where: { id },
      relations: ['usuario', 'servicio', 'veterinario']
    });

    if (!calificacion) {
      throw new NotFoundException(`Calificacion with ID ${id} not found`);
    }

    return calificacion;
  }

  async findByServicio(servicioId: number): Promise<Calificacion[]> {
    return this.calificacionesRepository.find({
      where: { servicioId, estado: 'APROBADA' },
      relations: ['usuario', 'servicio', 'veterinario'],
      order: { fecha: 'DESC' }
    });
  }

  async findByUsuario(usuarioId: number): Promise<Calificacion[]> {
    return this.calificacionesRepository.find({
      where: { usuarioId },
      relations: ['servicio', 'veterinario'],
      order: { fecha: 'DESC' }
    });
  }

  async findByVeterinario(veterinarioId: number): Promise<Calificacion[]> {
    return this.calificacionesRepository.find({
      where: { veterinarioId, estado: 'APROBADA' },
      relations: ['usuario', 'servicio'],
      order: { fecha: 'DESC' }
    });
  }

  async update(id: number, updateCalificacionDto: UpdateCalificacionDto): Promise<Calificacion> {
    const calificacion = await this.findOne(id);
    Object.assign(calificacion, updateCalificacionDto);
    return this.calificacionesRepository.save(calificacion);
  }

  async remove(id: number): Promise<void> {
    const calificacion = await this.findOne(id);
    await this.calificacionesRepository.remove(calificacion);
  }

  // Reportes y estadísticas
  async getEstadisticasPorServicio(servicioId: number): Promise<any> {
    const result = await this.calificacionesRepository
      .createQueryBuilder('calificacion')
      .select('COUNT(calificacion.id)', 'totalCalificaciones')
      .addSelect('AVG(calificacion.puntuacion)', 'promedioCalificacion')
      .addSelect('COUNT(CASE WHEN calificacion.puntuacion >= 4 THEN 1 END)', 'calificacionesPositivas')
      .addSelect('COUNT(CASE WHEN calificacion.puntuacion <= 2 THEN 1 END)', 'calificacionesNegativas')
      .where('calificacion.servicioId = :servicioId', { servicioId })
      .andWhere('calificacion.estado = :estado', { estado: 'APROBADA' })
      .getRawOne();

    return {
      totalCalificaciones: parseInt(result?.totalCalificaciones || '0'),
      promedioCalificacion: parseFloat(result?.promedioCalificacion || '0').toFixed(2),
      calificacionesPositivas: parseInt(result?.calificacionesPositivas || '0'),
      calificacionesNegativas: parseInt(result?.calificacionesNegativas || '0')
    };
  }

  async getEstadisticasPorVeterinario(veterinarioId: number): Promise<any> {
    const result = await this.calificacionesRepository
      .createQueryBuilder('calificacion')
      .select('COUNT(calificacion.id)', 'totalCalificaciones')
      .addSelect('AVG(calificacion.puntuacion)', 'promedioCalificacion')
      .where('calificacion.veterinarioId = :veterinarioId', { veterinarioId })
      .andWhere('calificacion.estado = :estado', { estado: 'APROBADA' })
      .getRawOne();

    return {
      totalCalificaciones: parseInt(result?.totalCalificaciones || '0'),
      promedioCalificacion: parseFloat(result?.promedioCalificacion || '0').toFixed(2)
    };
  }

  async getCalificacionesPendientes(): Promise<Calificacion[]> {
    return this.calificacionesRepository.find({
      where: { estado: 'PENDIENTE' },
      relations: ['usuario', 'servicio', 'veterinario'],
      order: { fecha: 'ASC' }
    });
  }
}
