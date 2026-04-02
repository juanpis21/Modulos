import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cita } from './entities/cita.entity';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { UsersService } from '../users/users.service';
import { PetsService } from '../pets/pets.service';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class CitasService {
  constructor(
    @InjectRepository(Cita)
    private citasRepository: Repository<Cita>,
    private usersService: UsersService,
    private petsService: PetsService,
    private rolesService: RolesService,
  ) {}

  async create(createCitaDto: CreateCitaDto): Promise<Cita> {
    // Verificar si el usuario existe
    const usuario = await this.usersService.findOne(createCitaDto.usuarioId);
    if (!usuario) {
      throw new NotFoundException(`Usuario with ID ${createCitaDto.usuarioId} not found`);
    }

    // Verificar si la mascota existe
    const mascota = await this.petsService.findOne(createCitaDto.mascotaId);
    if (!mascota) {
      throw new NotFoundException(`Mascota with ID ${createCitaDto.mascotaId} not found`);
    }

    // Verificar si la mascota pertenece al usuario
    if (mascota.ownerId !== createCitaDto.usuarioId) {
      throw new ConflictException('La mascota no pertenece al usuario especificado');
    }

    // Convertir string de fecha a Date
    const fechaHora = new Date(createCitaDto.fechaHora);
    
    // Verificar que la fecha sea futura
    if (fechaHora <= new Date()) {
      throw new ConflictException('La fecha de la cita debe ser futura');
    }

    // Verificar si ya existe una cita para la misma mascota en el mismo horario
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

    return this.citasRepository.save(cita);
  }

  async findAll(): Promise<Cita[]> {
    return this.citasRepository.find({ 
      relations: ['usuario', 'mascota', 'veterinario'],
      select: ['id', 'motivo', 'fechaHora', 'estado', 'notas', 'createdAt', 'updatedAt', 'usuario', 'mascota', 'veterinario']
    });
  }

  async findOne(id: number): Promise<Cita> {
    const cita = await this.citasRepository.findOne({
      where: { id },
      relations: ['usuario', 'mascota', 'veterinario'],
      select: ['id', 'motivo', 'fechaHora', 'estado', 'notas', 'createdAt', 'updatedAt', 'usuario', 'mascota', 'veterinario']
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
    const fechaInicio = new Date(fecha);
    const fechaFin = new Date(fecha);
    fechaFin.setDate(fechaFin.getDate() + 1);

    return this.citasRepository
      .createQueryBuilder('cita')
      .leftJoinAndSelect('cita.usuario', 'usuario')
      .leftJoinAndSelect('cita.mascota', 'mascota')
      .where('cita.fechaHora >= :fechaInicio', { fechaInicio })
      .andWhere('cita.fechaHora < :fechaFin', { fechaFin })
      .andWhere('cita.isActive = :isActive', { isActive: true })
      .select(['cita.id', 'cita.motivo', 'cita.fechaHora', 'cita.estado', 'cita.notas', 'cita.idVeterinario', 'cita.isActive', 'cita.createdAt', 'cita.updatedAt', 'usuario', 'mascota'])
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
    await this.citasRepository.remove(cita);
  }
}
