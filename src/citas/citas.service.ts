import { Injectable, NotFoundException, ConflictException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cita } from './entities/cita.entity';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { UsersService } from '../users/users.service';
import { PetsService } from '../pets/pets.service';
import { RolesService } from '../roles/roles.service';
import { HistorialCitasService } from '../historial-citas/historial-citas.service';

@Injectable()
export class CitasService {
  constructor(
    @InjectRepository(Cita)
    private citasRepository: Repository<Cita>,
    private usersService: UsersService,
    private petsService: PetsService,
    private rolesService: RolesService,
    @Inject(forwardRef(() => HistorialCitasService))
    private historialCitasService: HistorialCitasService,
  ) { }

  async create(createCitaDto: CreateCitaDto): Promise<Cita> {

    const usuario = await this.usersService.findOne(createCitaDto.usuarioId);
    if (!usuario) {
      throw new NotFoundException(`Usuario with ID ${createCitaDto.usuarioId} not found`);
    }

    const mascota = await this.petsService.findOne(createCitaDto.mascotaId);
    if (!mascota) {
      throw new NotFoundException(`Mascota with ID ${createCitaDto.mascotaId} not found`);
    }

    if (mascota.ownerId !== createCitaDto.usuarioId) {
      throw new ConflictException('La mascota no pertenece al usuario especificado');
    }

    const fechaHora = new Date(createCitaDto.fechaHora);

    if (fechaHora <= new Date()) {
      throw new ConflictException('La fecha de la cita debe ser futura');
    }

    const existingCita = await this.citasRepository.findOne({
      where: {
        mascota: { id: createCitaDto.mascotaId },
        fechaHora: fechaHora
      },
      relations: ['mascota']
    });

    if (existingCita) {
      throw new ConflictException('Ya existe una cita para esta mascota en el mismo horario');
    }

    const cita = this.citasRepository.create({
      ...createCitaDto,
      fechaHora,
      usuario,
      mascota,
    });

    const savedCita = await this.citasRepository.save(cita);

    await this.historialCitasService.registrarCreacionCita(
      savedCita.id,
      createCitaDto.usuarioId,
      `Se creó la cita para ${mascota.name} el ${fechaHora.toISOString()}`
    );

    return savedCita;
  }

  async findAll(): Promise<Cita[]> {
    return this.citasRepository.find({
      where: { isActive: true },
      relations: ['usuario', 'mascota', 'veterinario'],
      select: ['id', 'motivo', 'fechaHora', 'estado', 'notas', 'isActive', 'createdAt', 'updatedAt', 'usuario', 'mascota', 'veterinario']
    });
  }

  async findOne(id: number): Promise<Cita> {
    const cita = await this.citasRepository.findOne({
      where: { id, isActive: true },
      relations: ['usuario', 'mascota', 'veterinario'],
      select: ['id', 'motivo', 'fechaHora', 'estado', 'notas', 'isActive', 'createdAt', 'updatedAt', 'usuario', 'mascota', 'veterinario']
    });

    if (!cita) {
      throw new NotFoundException(`Cita with ID ${id} not found`);
    }

    return cita;
  }

  async findByUsuario(usuarioId: number): Promise<Cita[]> {
    return this.citasRepository.find({
      where: { usuario: { id: usuarioId } },
      relations: ['usuario', 'mascota', 'veterinario'],
      select: ['id', 'motivo', 'fechaHora', 'estado', 'notas', 'createdAt', 'updatedAt', 'usuario', 'mascota', 'veterinario'],
      order: { fechaHora: 'ASC' }
    });
  }

  async findByMascota(mascotaId: number): Promise<Cita[]> {
    return this.citasRepository.find({
      where: { mascota: { id: mascotaId } },
      relations: ['usuario', 'mascota', 'veterinario'],
      select: ['id', 'motivo', 'fechaHora', 'estado', 'notas', 'createdAt', 'updatedAt', 'usuario', 'mascota', 'veterinario'],
      order: { fechaHora: 'ASC' }
    });
  }

  async findByEstado(estado: string): Promise<Cita[]> {
    return this.citasRepository.find({
      where: { estado, isActive: true },
      relations: ['usuario', 'mascota', 'veterinario'],
      select: ['id', 'motivo', 'fechaHora', 'estado', 'notas', 'isActive', 'createdAt', 'updatedAt', 'usuario', 'mascota', 'veterinario'],
      order: { fechaHora: 'ASC' }
    });
  }

  async findByFecha(fecha: string): Promise<Cita[]> {
    const fechaQuery = new Date(fecha);
    
    // Validar si la fecha es válida
    if (isNaN(fechaQuery.getTime())) {
      throw new Error('Formato de fecha inválido. Use YYYY-MM-DD');
    }

    // Ajustar para que busque desde el inicio del día (00:00:00) 
    // hasta el final del día (23:59:59)
    const fechaInicio = new Date(fechaQuery);
    fechaInicio.setUTCHours(0, 0, 0, 0);

    const fechaFin = new Date(fechaQuery);
    fechaFin.setUTCHours(23, 59, 59, 999);

    return this.citasRepository
      .createQueryBuilder('cita')
      .leftJoinAndSelect('cita.usuario', 'usuario')
      .leftJoinAndSelect('cita.mascota', 'mascota')
      .leftJoinAndSelect('cita.veterinario', 'veterinario')
      .where('cita.fechaHora BETWEEN :fechaInicio AND :fechaFin', { 
        fechaInicio, 
        fechaFin 
      })
      .andWhere('cita.isActive = :isActive', { isActive: true })
      .select([
        'cita.id', 'cita.motivo', 'cita.fechaHora', 'cita.estado', 'cita.notas', 
        'cita.isActive', 'cita.createdAt', 'cita.updatedAt', 
        'usuario.id', 'usuario.username', 'usuario.email', 'usuario.fullName',
        'mascota.id', 'mascota.name', 'mascota.species',
        'veterinario.id', 'veterinario.name'
      ])
      .orderBy('cita.fechaHora', 'ASC')
      .getMany();
  }

  async update(id: number, updateCitaDto: UpdateCitaDto): Promise<Cita> {
    // Primero obtener la cita actual con relaciones
    const cita = await this.citasRepository.findOne({
      where: { id },
      relations: ['usuario', 'mascota']
    });

    if (!cita) {
      throw new NotFoundException(`Cita with ID ${id} not found`);
    }

    // Verificar usuario si se proporciona
    if (updateCitaDto.usuarioId && updateCitaDto.usuarioId !== cita.usuario.id) {
      const usuario = await this.usersService.findOne(updateCitaDto.usuarioId);
      if (!usuario) {
        throw new NotFoundException(`Usuario with ID ${updateCitaDto.usuarioId} not found`);
      }
      cita.usuario = usuario;
    }

    // Verificar mascota si se proporciona
    if (updateCitaDto.mascotaId && updateCitaDto.mascotaId !== cita.mascota.id) {
      const mascota = await this.petsService.findOne(updateCitaDto.mascotaId);
      if (!mascota) {
        throw new NotFoundException(`Mascota with ID ${updateCitaDto.mascotaId} not found`);
      }

      // Verificar que la mascota pertenezca al usuario
      const usuarioId = updateCitaDto.usuarioId || cita.usuario.id;
      if (mascota.ownerId !== usuarioId) {
        throw new ConflictException('La mascota no pertenece al usuario especificado');
      }
      cita.mascota = mascota;
    }

    // Actualizar solo los campos proporcionados
    if (updateCitaDto.motivo !== undefined) {
      cita.motivo = updateCitaDto.motivo;
    }
    if (updateCitaDto.fechaHora !== undefined) {
      const nuevaFecha = new Date(updateCitaDto.fechaHora);

      // Verificar que la fecha sea futura (excepto si se está cancelando)
      if (updateCitaDto.estado !== 'Cancelada' && nuevaFecha <= new Date()) {
        throw new ConflictException('La fecha de la cita debe ser futura');
      }
      cita.fechaHora = nuevaFecha;
    }
    if (updateCitaDto.estado !== undefined) {
      cita.estado = updateCitaDto.estado;
    }
    if (updateCitaDto.notas !== undefined) {
      cita.notas = updateCitaDto.notas;
    }
    if (updateCitaDto.idVeterinario !== undefined) {
      const veterinario = await this.rolesService.findOne(updateCitaDto.idVeterinario);
      if (!veterinario) {
        throw new NotFoundException(`Veterinario with ID ${updateCitaDto.idVeterinario} not found`);
      }
      cita.veterinario = veterinario;
    }
    if (updateCitaDto.isActive !== undefined) {
      cita.isActive = updateCitaDto.isActive;
    }

    // Guardar cambios
    await this.citasRepository.save(cita);

    // Registrar cambios en el historial
    const cambios = [];

    if (updateCitaDto.motivo !== undefined && updateCitaDto.motivo !== cita.motivo) {
      cambios.push({ campo: 'motivo', anterior: cita.motivo, nuevo: updateCitaDto.motivo });
    }
    if (updateCitaDto.fechaHora !== undefined && updateCitaDto.fechaHora !== cita.fechaHora.toISOString()) {
      cambios.push({ campo: 'fechaHora', anterior: cita.fechaHora.toISOString(), nuevo: updateCitaDto.fechaHora });
    }
    if (updateCitaDto.estado !== undefined && updateCitaDto.estado !== cita.estado) {
      cambios.push({ campo: 'estado', anterior: cita.estado, nuevo: updateCitaDto.estado });
    }
    if (updateCitaDto.notas !== undefined && updateCitaDto.notas !== cita.notas) {
      cambios.push({ campo: 'notas', anterior: cita.notas || '', nuevo: updateCitaDto.notas || '' });
    }

    // Registrar cada cambio en el historial
    for (const cambio of cambios) {
      await this.historialCitasService.registrarActualizacionCita(
        cita.id,
        cita.usuario.id,
        `Se actualizó el campo ${cambio.campo}: de "${cambio.anterior}" a "${cambio.nuevo}"`,
        cambio.anterior,
        cambio.nuevo
      );
    }

    // Devolver la cita actualizada con relaciones desde la base de datos
    const updatedCita = await this.citasRepository.findOne({
      where: { id: cita.id },
      relations: ['usuario', 'mascota', 'veterinario'],
      select: ['id', 'motivo', 'fechaHora', 'estado', 'notas', 'isActive', 'createdAt', 'updatedAt', 'usuario', 'mascota', 'veterinario']
    });

    return updatedCita;
  }

  async remove(id: number): Promise<void> {
    const cita = await this.findOne(id);

    // Registrar eliminación en el historial
    await this.historialCitasService.registrarCancelacionCita(
      cita.id,
      cita.usuario.id,
      `Se eliminó la cita para ${cita.mascota.name} programada para ${cita.fechaHora.toISOString()}`
    );

    // Borrado Lógico: En lugar de remove, marcamos como inactiva
    cita.isActive = false;
    await this.citasRepository.save(cita);
  }
}
