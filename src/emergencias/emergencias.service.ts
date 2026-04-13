import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Emergencia } from './entities/emergencia.entity';
import { CreateEmergenciaDto } from './dto/create-emergencia.dto';
import { UpdateEmergenciaDto } from './dto/update-emergencia.dto';
import { PetsService } from '../pets/pets.service';
import { RolesService } from '../roles/roles.service';
import { VeterinariasService } from '../veterinarias/veterinarias.service';

@Injectable()
export class EmergenciasService {
  constructor(
    @InjectRepository(Emergencia)
    private emergenciasRepository: Repository<Emergencia>,
    private petsService: PetsService,
    private rolesService: RolesService,
    private veterinariasService: VeterinariasService,
  ) {}

  async create(createEmergenciaDto: CreateEmergenciaDto): Promise<Emergencia> {
    // Verificar si la mascota existe
    const mascota = await this.petsService.findOne(createEmergenciaDto.mascotaId);
    if (!mascota) {
      throw new NotFoundException(`Mascota with ID ${createEmergenciaDto.mascotaId} not found`);
    }

    // Verificar si el veterinario existe
    const veterinario = await this.rolesService.findOne(createEmergenciaDto.veterinarioId);
    if (!veterinario) {
      throw new NotFoundException(`Veterinario with ID ${createEmergenciaDto.veterinarioId} not found`);
    }

    // Verificar si la veterinaria existe
    const veterinaria = await this.veterinariasService.findOne(createEmergenciaDto.veterinariaId);
    if (!veterinaria) {
      throw new NotFoundException(`Veterinaria with ID ${createEmergenciaDto.veterinariaId} not found`);
    }

    const emergencia = this.emergenciasRepository.create({
      ...createEmergenciaDto,
      mascota,
      veterinario,
      veterinaria,
      fechayhora: createEmergenciaDto.fechayhora || new Date(),
    });

    return this.emergenciasRepository.save(emergencia);
  }

  async findAll(): Promise<Emergencia[]> {
    return this.emergenciasRepository.find({ 
      relations: ['mascota', 'veterinario', 'veterinaria'],
      select: ['id', 'tipo', 'fechayhora', 'descripcion', 'isActive', 'createdAt', 'updatedAt', 'mascota', 'veterinario', 'veterinaria'],
      order: { fechayhora: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Emergencia> {
    const emergencia = await this.emergenciasRepository.findOne({
      where: { id },
      relations: ['mascota', 'veterinario', 'veterinaria'],
      select: ['id', 'tipo', 'fechayhora', 'descripcion', 'isActive', 'createdAt', 'updatedAt', 'mascota', 'veterinario', 'veterinaria']
    });

    if (!emergencia) {
      throw new NotFoundException(`Emergencia with ID ${id} not found`);
    }

    return emergencia;
  }

  async findByMascota(mascotaId: number): Promise<Emergencia[]> {
    return this.emergenciasRepository.find({
      where: { mascota: { id: mascotaId }, isActive: true },
      relations: ['mascota', 'veterinario', 'veterinaria'],
      select: ['id', 'tipo', 'fechayhora', 'descripcion', 'isActive', 'createdAt', 'updatedAt', 'mascota', 'veterinario', 'veterinaria'],
      order: { fechayhora: 'DESC' }
    });
  }

  async findByVeterinario(veterinarioId: number): Promise<Emergencia[]> {
    return this.emergenciasRepository.find({
      where: { veterinario: { id: veterinarioId }, isActive: true },
      relations: ['mascota', 'veterinario', 'veterinaria'],
      select: ['id', 'tipo', 'fechayhora', 'descripcion', 'isActive', 'createdAt', 'updatedAt', 'mascota', 'veterinario', 'veterinaria'],
      order: { fechayhora: 'DESC' }
    });
  }

  async findByVeterinaria(veterinariaId: number): Promise<Emergencia[]> {
    return this.emergenciasRepository.find({
      where: { veterinaria: { id: veterinariaId }, isActive: true },
      relations: ['mascota', 'veterinario', 'veterinaria'],
      select: ['id', 'tipo', 'fechayhora', 'descripcion', 'isActive', 'createdAt', 'updatedAt', 'mascota', 'veterinario', 'veterinaria'],
      order: { fechayhora: 'DESC' }
    });
  }

  async findByTipo(tipo: string): Promise<Emergencia[]> {
    return this.emergenciasRepository.find({
      where: { tipo, isActive: true },
      relations: ['mascota', 'veterinario', 'veterinaria'],
      select: ['id', 'tipo', 'fechayhora', 'descripcion', 'isActive', 'createdAt', 'updatedAt', 'mascota', 'veterinario', 'veterinaria'],
      order: { fechayhora: 'DESC' }
    });
  }

  async findByFecha(fecha: string): Promise<Emergencia[]> {
    const inicioQuery = new Date(fecha);
    
    // Validar si la fecha es válida
    if (isNaN(inicioQuery.getTime())) {
      throw new Error('Formato de fecha inválido. Use YYYY-MM-DD');
    }

    // Ajustar para cubrir el día completo (00:00:00 a 23:59:59)
    const fechaInicio = new Date(inicioQuery);
    fechaInicio.setUTCHours(0, 0, 0, 0);

    const fechaFin = new Date(inicioQuery);
    fechaFin.setUTCHours(23, 59, 59, 999);

    return this.emergenciasRepository
      .createQueryBuilder('emergencia')
      .leftJoinAndSelect('emergencia.mascota', 'mascota')
      .leftJoinAndSelect('emergencia.veterinario', 'veterinario')
      .leftJoinAndSelect('emergencia.veterinaria', 'veterinaria')
      .where('emergencia.fechayhora BETWEEN :fechaInicio AND :fechaFin AND emergencia.isActive = :isActive', {
        fechaInicio,
        fechaFin,
        isActive: true,
      })
      .select(['emergencia.id', 'emergencia.tipo', 'emergencia.fechayhora', 'emergencia.descripcion', 'emergencia.isActive', 'emergencia.createdAt', 'emergencia.updatedAt'])
      .addSelect(['mascota.id', 'mascota.name', 'mascota.species'])
      .addSelect(['veterinario.id', 'veterinario.name'])
      .addSelect(['veterinaria.id', 'veterinaria.nombre'])
      .orderBy('emergencia.fechayhora', 'DESC')
      .getMany();
  }

  async update(id: number, updateEmergenciaDto: UpdateEmergenciaDto): Promise<Emergencia> {
    // Primero obtener la emergencia actual con relaciones
    const emergencia = await this.emergenciasRepository.findOne({
      where: { id },
      relations: ['mascota', 'veterinario', 'veterinaria']
    });

    if (!emergencia) {
      throw new NotFoundException(`Emergencia with ID ${id} not found`);
    }

    // Verificar mascota si se proporciona
    if (updateEmergenciaDto.mascotaId && updateEmergenciaDto.mascotaId !== emergencia.mascota.id) {
      const mascota = await this.petsService.findOne(updateEmergenciaDto.mascotaId);
      if (!mascota) {
        throw new NotFoundException(`Mascota with ID ${updateEmergenciaDto.mascotaId} not found`);
      }
      emergencia.mascota = mascota;
    }

    // Verificar veterinario si se proporciona
    if (updateEmergenciaDto.veterinarioId && updateEmergenciaDto.veterinarioId !== emergencia.veterinario.id) {
      const veterinario = await this.rolesService.findOne(updateEmergenciaDto.veterinarioId);
      if (!veterinario) {
        throw new NotFoundException(`Veterinario with ID ${updateEmergenciaDto.veterinarioId} not found`);
      }
      emergencia.veterinario = veterinario;
    }

    // Verificar veterinaria si se proporciona
    if (updateEmergenciaDto.veterinariaId && updateEmergenciaDto.veterinariaId !== emergencia.veterinaria.id) {
      const veterinaria = await this.veterinariasService.findOne(updateEmergenciaDto.veterinariaId);
      if (!veterinaria) {
        throw new NotFoundException(`Veterinaria with ID ${updateEmergenciaDto.veterinariaId} not found`);
      }
      emergencia.veterinaria = veterinaria;
    }

    // Actualizar solo los campos proporcionados
    if (updateEmergenciaDto.tipo !== undefined) {
      emergencia.tipo = updateEmergenciaDto.tipo;
    }
    if (updateEmergenciaDto.descripcion !== undefined) {
      emergencia.descripcion = updateEmergenciaDto.descripcion;
    }
    if (updateEmergenciaDto.fechayhora !== undefined) {
      emergencia.fechayhora = updateEmergenciaDto.fechayhora;
    }
    if (updateEmergenciaDto.isActive !== undefined) {
      emergencia.isActive = updateEmergenciaDto.isActive;
    }

    // Guardar cambios
    await this.emergenciasRepository.save(emergencia);
    
    // Devolver la emergencia actualizada con relaciones desde la base de datos
    const updatedEmergencia = await this.emergenciasRepository.findOne({
      where: { id: emergencia.id },
      relations: ['mascota', 'veterinario', 'veterinaria'],
      select: ['id', 'tipo', 'fechayhora', 'descripcion', 'isActive', 'createdAt', 'updatedAt', 'mascota', 'veterinario', 'veterinaria']
    });

    return updatedEmergencia;
  }

  async remove(id: number): Promise<void> {
    const emergencia = await this.findOne(id);
    await this.emergenciasRepository.remove(emergencia);
  }
}
