import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReporteMaltrato, EstadoReporte } from './entities/reporte-maltrato.entity';
import { CreateReporteMaltratoDto } from './dto/create-reporte-maltrato.dto';
import { UpdateReporteMaltratoDto } from './dto/update-reporte-maltrato.dto';
import { PetsService } from '../pets/pets.service';

@Injectable()
export class ReportesMaltratoService {
  constructor(
    @InjectRepository(ReporteMaltrato)
    private reportesRepository: Repository<ReporteMaltrato>,
    private petsService: PetsService,
  ) {}

  async create(createDto: CreateReporteMaltratoDto, usuarioId: number): Promise<ReporteMaltrato> {
    // Si envían un ID de mascota (la víctima está registrada), validamos que exista
    if (createDto.mascotaId) {
      await this.petsService.findOne(createDto.mascotaId);
    }

    const reporte = this.reportesRepository.create({
      ...createDto,
      usuarioId,
      estado: EstadoReporte.PENDIENTE,
    });

    return this.reportesRepository.save(reporte);
  }

  async findAll(): Promise<ReporteMaltrato[]> {
    return this.reportesRepository.find({
      relations: ['usuario', 'mascota'],
      order: { fecha: 'DESC' }
    });
  }

  async findByUsuario(usuarioId: number): Promise<ReporteMaltrato[]> {
    return this.reportesRepository.find({
      where: { usuarioId },
      relations: ['mascota'],
      order: { fecha: 'DESC' }
    });
  }

  async findOne(id: number): Promise<ReporteMaltrato> {
    const reporte = await this.reportesRepository.findOne({
      where: { id },
      relations: ['usuario', 'mascota']
    });

    if (!reporte) {
      throw new NotFoundException(`Reporte de maltrato #${id} no encontrado.`);
    }

    return reporte;
  }

  async updateEstado(id: number, updateDto: UpdateReporteMaltratoDto): Promise<ReporteMaltrato> {
    const reporte = await this.findOne(id);
    
    if (updateDto.estado) reporte.estado = updateDto.estado;
    if (updateDto.descripcion) reporte.descripcion = updateDto.descripcion;

    return this.reportesRepository.save(reporte);
  }

  async remove(id: number): Promise<void> {
    const reporte = await this.findOne(id);
    await this.reportesRepository.delete(reporte.id);
  }
}
