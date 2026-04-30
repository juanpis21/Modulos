import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistoriaClinica } from './entities/historia-clinica.entity';
import { CreateHistoriaClinicaDto } from './dto/create-historia-clinica.dto';
import { UpdateHistoriaClinicaDto } from './dto/update-historia-clinica.dto';
import { PetsService } from '../pets/pets.service';
import { RolesService } from '../roles/roles.service';
import { VeterinariasService } from '../veterinarias/veterinarias.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class HistoriasClinicasService {
  constructor(
    @InjectRepository(HistoriaClinica)
    private historiaClinicaRepository: Repository<HistoriaClinica>,
    private petsService: PetsService,
    private rolesService: RolesService,
    private veterinariasService: VeterinariasService,
    private usersService: UsersService,
  ) {}

  async create(createDto: CreateHistoriaClinicaDto): Promise<HistoriaClinica> {
    // 1. Verificación Fuerte: ¿Esta mascota ya tiene un expediente OneToOne?
    const existing = await this.historiaClinicaRepository.findOne({
      where: { mascotaId: createDto.mascotaId }
    });

    if (existing) {
      throw new ConflictException(`La mascota con ID ${createDto.mascotaId} ya posee una Historia Clínica. Actualice el fólder existente.`);
    }

    // 2. Validar relaciones foráneas
    await this.petsService.findOne(createDto.mascotaId);
    await this.rolesService.findOne(createDto.veterinarioId);
    await this.veterinariasService.findOne(createDto.veterinariaId);
    await this.usersService.findOne(createDto.usuarioId);

    const nuevaHistoria = this.historiaClinicaRepository.create(createDto);
    return this.historiaClinicaRepository.save(nuevaHistoria);
  }

  async findAll(): Promise<HistoriaClinica[]> {
    return this.historiaClinicaRepository.find({
      relations: ['mascota', 'veterinario', 'veterinaria', 'usuario'],
      order: { fecha: 'DESC' }
    });
  }

  async findOne(id: number): Promise<HistoriaClinica> {
    const historia = await this.historiaClinicaRepository.findOne({
      where: { id },
      relations: ['mascota', 'veterinario', 'veterinaria', 'usuario']
    });

    if (!historia) {
      throw new NotFoundException(`El expediente maestro con ID ${id} no existe.`);
    }
    return historia;
  }

  async findByMascota(mascotaId: number): Promise<HistoriaClinica> {
    const historia = await this.historiaClinicaRepository.findOne({
      where: { mascotaId },
      relations: ['veterinario', 'veterinaria', 'usuario']
    });

    if (!historia) {
      throw new NotFoundException(`Aún no se ha aperturado un expediente maestro para el paciente ID ${mascotaId}`);
    }
    return historia;
  }

  async update(id: number, updateDto: UpdateHistoriaClinicaDto): Promise<HistoriaClinica> {
    const historia = await this.findOne(id);

    // Si cambian de veterinario o veterinaria y es distinto al de base, validamos
    if (updateDto.veterinarioId && updateDto.veterinarioId !== historia.veterinarioId) {
      await this.rolesService.findOne(updateDto.veterinarioId);
      historia.veterinarioId = updateDto.veterinarioId;
    }
    if (updateDto.veterinariaId && updateDto.veterinariaId !== historia.veterinariaId) {
      await this.veterinariasService.findOne(updateDto.veterinariaId);
      historia.veterinariaId = updateDto.veterinariaId;
    }

    // Lógica inteligente para Diagnósticos y Tratamientos acumulativos
    if (updateDto.appendMode) {
      const ts = new Date().toLocaleDateString('es-ES');
      if (updateDto.diagnostico) {
         historia.diagnostico = (historia.diagnostico ? historia.diagnostico + '\n\n' : '') + `[${ts}] ` + updateDto.diagnostico;
      }
      if (updateDto.tratamiento) {
         historia.tratamiento = (historia.tratamiento ? historia.tratamiento + '\n\n' : '') + `[${ts}] ` + updateDto.tratamiento;
      }
    } else {
      // Reemplazo normal
      if (updateDto.diagnostico !== undefined) historia.diagnostico = updateDto.diagnostico;
      if (updateDto.tratamiento !== undefined) historia.tratamiento = updateDto.tratamiento;
    }

    return this.historiaClinicaRepository.save(historia);
  }

  async remove(id: number): Promise<void> {
    const historia = await this.findOne(id);
    await this.historiaClinicaRepository.delete(historia.id); // Usamos delete para mejor performance
  }
}
