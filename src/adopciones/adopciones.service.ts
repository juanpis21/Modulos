import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Adopcion, EstadoAdopcion } from './entities/adopcion.entity';
import { CreateAdopcionDto } from './dto/create-adopcion.dto';
import { UpdateAdopcionDto } from './dto/update-adopcion.dto';
import { PetsService } from '../pets/pets.service';
import { UsersService } from '../users/users.service';
import { VeterinariasService } from '../veterinarias/veterinarias.service';

@Injectable()
export class AdopcionesService {
  constructor(
    @InjectRepository(Adopcion)
    private adopcionesRepository: Repository<Adopcion>,
    private petsService: PetsService,
    private usersService: UsersService,
    private veterinariasService: VeterinariasService,
  ) {}

  async create(createAdopcionDto: CreateAdopcionDto): Promise<Adopcion> {
    // Verificar si la mascota existe y está disponible para adopción
    const mascota = await this.petsService.findOne(createAdopcionDto.mascotaId);
    if (!mascota) {
      throw new NotFoundException(`Mascota with ID ${createAdopcionDto.mascotaId} not found`);
    }

    // Verificar si el usuario existe
    const adoptante = await this.usersService.findOne(createAdopcionDto.adoptanteId);
    if (!adoptante) {
      throw new NotFoundException(`Usuario with ID ${createAdopcionDto.adoptanteId} not found`);
    }

    // Verificar si la veterinaria existe
    const veterinaria = await this.veterinariasService.findOne(createAdopcionDto.veterinariaId);
    if (!veterinaria) {
      throw new NotFoundException(`Veterinaria with ID ${createAdopcionDto.veterinariaId} not found`);
    }

    // Verificar si ya existe una adopción activa para esta mascota
    const adopcionActiva = await this.adopcionesRepository.findOne({
      where: { 
        mascota: { id: createAdopcionDto.mascotaId },
        estado: EstadoAdopcion.APROBADA,
        isActive: true 
      }
    });

    if (adopcionActiva) {
      throw new ConflictException('Esta mascota ya tiene una adopción activa');
    }

    const adopcion = this.adopcionesRepository.create({
      ...createAdopcionDto,
      mascota,
      adoptante,
      veterinaria,
    });

    return this.adopcionesRepository.save(adopcion);
  }

  async findAll(): Promise<Adopcion[]> {
    return this.adopcionesRepository.find({ 
      relations: ['mascota', 'adoptante', 'veterinaria'],
      order: { fechaSolicitud: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Adopcion> {
    const adopcion = await this.adopcionesRepository.findOne({
      where: { id },
      relations: ['mascota', 'adoptante', 'veterinaria'],
    });

    if (!adopcion) {
      throw new NotFoundException(`Adopcion with ID ${id} not found`);
    }

    return adopcion;
  }

  async findByMascota(mascotaId: number): Promise<Adopcion[]> {
    // Verificar si la mascota existe
    const mascota = await this.petsService.findOne(mascotaId);
    if (!mascota) {
      throw new NotFoundException(`Mascota with ID ${mascotaId} not found`);
    }

    return this.adopcionesRepository.find({
      where: { mascota: { id: mascotaId } },
      relations: ['adoptante', 'veterinaria'],
      order: { fechaSolicitud: 'DESC' }
    });
  }

  async findByAdoptante(adoptanteId: number): Promise<Adopcion[]> {
    // Verificar si el usuario existe
    const adoptante = await this.usersService.findOne(adoptanteId);
    if (!adoptante) {
      throw new NotFoundException(`Usuario with ID ${adoptanteId} not found`);
    }

    return this.adopcionesRepository.find({
      where: { adoptante: { id: adoptanteId } },
      relations: ['mascota', 'veterinaria'],
      order: { fechaSolicitud: 'DESC' }
    });
  }

  async findByVeterinaria(veterinariaId: number): Promise<Adopcion[]> {
    // Verificar si la veterinaria existe
    const veterinaria = await this.veterinariasService.findOne(veterinariaId);
    if (!veterinaria) {
      throw new NotFoundException(`Veterinaria with ID ${veterinariaId} not found`);
    }

    return this.adopcionesRepository.find({
      where: { veterinaria: { id: veterinariaId } },
      relations: ['mascota', 'adoptante'],
      order: { fechaSolicitud: 'DESC' }
    });
  }

  async findByEstado(estado: string): Promise<Adopcion[]> {
    return this.adopcionesRepository.find({
      where: { estado: EstadoAdopcion[estado] },
      relations: ['mascota', 'adoptante', 'veterinaria'],
      order: { fechaSolicitud: 'DESC' }
    });
  }

  async findByFechaRange(fechaInicio: string, fechaFin: string): Promise<Adopcion[]> {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    fin.setDate(fin.getDate() + 1); // Incluir el día final completo

    return this.adopcionesRepository
      .createQueryBuilder('adopcion')
      .leftJoinAndSelect('adopcion.mascota', 'mascota')
      .leftJoinAndSelect('adopcion.adoptante', 'adoptante')
      .leftJoinAndSelect('adopcion.veterinaria', 'veterinaria')
      .where('adopcion.fechaSolicitud >= :fechaInicio', { fechaInicio: inicio })
      .andWhere('adopcion.fechaSolicitud < :fechaFin', { fechaFin: fin })
      .orderBy('adopcion.fechaSolicitud', 'DESC')
      .getMany();
  }

  async update(id: number, updateAdopcionDto: UpdateAdopcionDto): Promise<Adopcion> {
    const adopcion = await this.findOne(id);

    // Actualizar solo los campos proporcionados
    if (updateAdopcionDto.fechaAprobacion !== undefined) {
      adopcion.fechaAprobacion = new Date(updateAdopcionDto.fechaAprobacion);
    }
    if (updateAdopcionDto.fechaEntrega !== undefined) {
      adopcion.fechaEntrega = new Date(updateAdopcionDto.fechaEntrega);
    }
    if (updateAdopcionDto.estado !== undefined) {
      adopcion.estado = updateAdopcionDto.estado;
    }
    if (updateAdopcionDto.motivo !== undefined) {
      adopcion.motivo = updateAdopcionDto.motivo;
    }
    if (updateAdopcionDto.observaciones !== undefined) {
      adopcion.observaciones = updateAdopcionDto.observaciones;
    }
    if (updateAdopcionDto.documentosRequeridos !== undefined) {
      adopcion.documentosRequeridos = updateAdopcionDto.documentosRequeridos;
    }
    if (updateAdopcionDto.costoAdopcion !== undefined) {
      adopcion.costoAdopcion = updateAdopcionDto.costoAdopcion;
    }
    if (updateAdopcionDto.isActive !== undefined) {
      adopcion.isActive = updateAdopcionDto.isActive;
    }

    return this.adopcionesRepository.save(adopcion);
  }

  async remove(id: number): Promise<void> {
    const adopcion = await this.findOne(id);
    await this.adopcionesRepository.remove(adopcion);
  }

  // Métodos auxiliares para gestión de estados
  async aprobarAdopcion(id: number, usuarioId: number, observaciones?: string): Promise<Adopcion> {
    const adopcion = await this.findOne(id);
    adopcion.estado = EstadoAdopcion.APROBADA;
    adopcion.fechaAprobacion = new Date();
    if (observaciones) {
      adopcion.observaciones = observaciones;
    }
    return this.adopcionesRepository.save(adopcion);
  }

  async completarAdopcion(id: number, usuarioId: number, observaciones?: string): Promise<Adopcion> {
    const adopcion = await this.findOne(id);
    adopcion.estado = EstadoAdopcion.COMPLETADA;
    adopcion.fechaEntrega = new Date();
    if (observaciones) {
      adopcion.observaciones = observaciones;
    }
    return this.adopcionesRepository.save(adopcion);
  }

  async rechazarAdopcion(id: number, usuarioId: number, motivo: string): Promise<Adopcion> {
    const adopcion = await this.findOne(id);
    adopcion.estado = EstadoAdopcion.RECHAZADA;
    adopcion.observaciones = `Rechazado: ${motivo}`;
    return this.adopcionesRepository.save(adopcion);
  }

  async cancelarAdopcion(id: number, usuarioId: number, motivo: string): Promise<Adopcion> {
    const adopcion = await this.findOne(id);
    adopcion.estado = EstadoAdopcion.CANCELADA;
    adopcion.observaciones = `Cancelado: ${motivo}`;
    return this.adopcionesRepository.save(adopcion);
  }
}
