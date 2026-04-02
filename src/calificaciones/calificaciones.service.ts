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
    // Verificar que el servicio existe
    await this.serviciosService.findOne(createCalificacionDto.servicioId);

    // Verificar que el usuario existe
    await this.usersService.findOne(usuarioId);

    // Verificar que el veterinario existe si se especifica
    if (createCalificacionDto.veterinarioId) {
      await this.usersService.findOne(createCalificacionDto.veterinarioId);
    }

    // Verificar que el usuario no haya calificado ya este servicio
    const existingCalificacion = await this.calificacionesRepository.findOne({
      where: { 
        usuarioId, 
        servicioId: createCalificacionDto.servicioId 
      }
    });

    if (existingCalificacion) {
      throw new ConflictException('Usuario ya ha calificado este servicio');
    }

    const calificacion = this.calificacionesRepository.create({
      ...createCalificacionDto,
      usuarioId
    });

    return this.calificacionesRepository.save(calificacion);
  }

  async findAll(): Promise<Calificacion[]> {
    return this.calificacionesRepository.find({
      relations: ['usuario', 'veterinario'],
      where: { estado: 'APROBADA' },
      order: { fecha: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Calificacion> {
    const calificacion = await this.calificacionesRepository.findOne({
      where: { id },
      relations: ['usuario', 'veterinario']
    });

    if (!calificacion) {
      throw new NotFoundException(`Calificacion with ID ${id} not found`);
    }

    return calificacion;
  }

  async findByServicio(servicioId: number): Promise<Calificacion[]> {
    return this.calificacionesRepository.find({
      where: { servicioId, estado: 'APROBADA' },
      relations: ['usuario', 'veterinario'],
      order: { fecha: 'DESC' }
    });
  }

  async findByUsuario(usuarioId: number): Promise<Calificacion[]> {
    return this.calificacionesRepository.find({
      where: { usuarioId },
      relations: ['veterinario'],
      order: { fecha: 'DESC' }
    });
  }

  async findByVeterinario(veterinarioId: number): Promise<Calificacion[]> {
    return this.calificacionesRepository.find({
      where: { veterinarioId, estado: 'APROBADA' },
      relations: ['usuario'],
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

    return result || {
      totalCalificaciones: 0,
      promedioCalificacion: 0,
      calificacionesPositivas: 0,
      calificacionesNegativas: 0
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

    return result || {
      totalCalificaciones: 0,
      promedioCalificacion: 0
    };
  }

  async getCalificacionesPendientes(): Promise<Calificacion[]> {
    return this.calificacionesRepository.find({
      where: { estado: 'PENDIENTE' },
      relations: ['usuario', 'veterinario'],
      order: { fecha: 'ASC' }
    });
  }
}
