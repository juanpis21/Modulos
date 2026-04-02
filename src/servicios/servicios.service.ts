import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Servicio } from './entities/servicio.entity';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { VeterinariasService } from '../veterinarias/veterinarias.service';

@Injectable()
export class ServiciosService {
  constructor(
    @InjectRepository(Servicio)
    private serviciosRepository: Repository<Servicio>,
    private veterinariasService: VeterinariasService,
  ) {}

  // CRUD Servicios
  async create(createServicioDto: CreateServicioDto): Promise<Servicio> {
    // Verificar que la veterinaria existe
    await this.veterinariasService.findOne(createServicioDto.veterinariaId);

    const servicio = this.serviciosRepository.create(createServicioDto);
    return this.serviciosRepository.save(servicio);
  }

  async findAll(): Promise<Servicio[]> {
    return this.serviciosRepository.find({ 
      relations: ['veterinaria'],
      where: { isActive: true },
      order: { nombre: 'ASC' }
    });
  }

  async findOne(id: number): Promise<Servicio> {
    const servicio = await this.serviciosRepository.findOne({
      where: { id },
      relations: ['veterinaria']
    });

    if (!servicio) {
      throw new NotFoundException(`Servicio with ID ${id} not found`);
    }

    return servicio;
  }

  async update(id: number, updateServicioDto: UpdateServicioDto): Promise<Servicio> {
    const servicio = await this.findOne(id);

    // Verificar que la veterinaria existe si se está actualizando
    if (updateServicioDto.veterinariaId) {
      await this.veterinariasService.findOne(updateServicioDto.veterinariaId);
    }

    Object.assign(servicio, updateServicioDto);
    return this.serviciosRepository.save(servicio);
  }

  async remove(id: number): Promise<void> {
    const servicio = await this.findOne(id);
    servicio.isActive = false;
    await this.serviciosRepository.save(servicio);
  }

  // Métodos adicionales
  async findByVeterinaria(veterinariaId: number): Promise<Servicio[]> {
    return this.serviciosRepository.find({
      where: { veterinariaId, isActive: true },
      relations: ['veterinaria'],
      order: { nombre: 'ASC' }
    });
  }

  async findByTipo(tipoServicio: string): Promise<Servicio[]> {
    return this.serviciosRepository.find({
      where: { tipoServicio, isActive: true },
      relations: ['veterinaria'],
      order: { nombre: 'ASC' }
    });
  }

  async searchServicios(query: string): Promise<Servicio[]> {
    return this.serviciosRepository
      .createQueryBuilder('servicio')
      .leftJoinAndSelect('servicio.veterinaria', 'veterinaria')
      .where('servicio.isActive = :isActive', { isActive: true })
      .andWhere(
        '(servicio.nombre ILIKE :query OR servicio.descripcion ILIKE :query OR servicio.etiquetas ILIKE :query)',
        { query: `%${query}%` }
      )
      .orderBy('servicio.nombre', 'ASC')
      .getMany();
  }

  // Reportes y estadísticas
  async getReporteServiciosPorVeterinaria(): Promise<any[]> {
    return this.serviciosRepository
      .createQueryBuilder('servicio')
      .leftJoin('servicio.veterinaria', 'veterinaria')
      .select('veterinaria.nombre', 'veterinaria')
      .addSelect('COUNT(servicio.id)', 'totalServicios')
      .addSelect('AVG(servicio.precioBase)', 'precioPromedio')
      .where('servicio.isActive = :isActive', { isActive: true })
      .groupBy('veterinaria.id')
      .addGroupBy('veterinaria.nombre')
      .orderBy('veterinaria.nombre', 'ASC')
      .getRawMany();
  }

  async getServiciosPorTipo(): Promise<any[]> {
    return this.serviciosRepository
      .createQueryBuilder('servicio')
      .select('servicio.tipoServicio', 'tipo')
      .addSelect('COUNT(servicio.id)', 'total')
      .addSelect('AVG(servicio.precioBase)', 'precioPromedio')
      .where('servicio.isActive = :isActive', { isActive: true })
      .groupBy('servicio.tipoServicio')
      .orderBy('total', 'DESC')
      .getRawMany();
  }
}
