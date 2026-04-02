import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Veterinaria } from './entities/veterinaria.entity';
import { CreateVeterinariaDto } from './dto/create-veterinaria.dto';
import { UpdateVeterinariaDto } from './dto/update-veterinaria.dto';

@Injectable()
export class VeterinariasService {
  constructor(
    @InjectRepository(Veterinaria)
    private veterinariasRepository: Repository<Veterinaria>,
  ) {}

  async create(createVeterinariaDto: CreateVeterinariaDto): Promise<Veterinaria> {
    // Verificar si ya existe una veterinaria con el mismo RUT
    const existingRut = await this.veterinariasRepository.findOne({
      where: { rut: createVeterinariaDto.rut },
    });

    if (existingRut) {
      throw new ConflictException('Veterinaria with this RUT already exists');
    }

    // Verificar si ya existe una veterinaria con el mismo email
    const existingEmail = await this.veterinariasRepository.findOne({
      where: { email: createVeterinariaDto.email },
    });

    if (existingEmail) {
      throw new ConflictException('Veterinaria with this email already exists');
    }

    const veterinaria = this.veterinariasRepository.create(createVeterinariaDto);
    return this.veterinariasRepository.save(veterinaria);
  }

  async findAll(): Promise<Veterinaria[]> {
    return this.veterinariasRepository.find({ 
      select: ['id', 'nombre', 'direccion', 'telefono', 'email', 'descripcion', 'rut', 'isActive', 'createdAt', 'updatedAt']
    });
  }

  async findOne(id: number): Promise<Veterinaria> {
    const veterinaria = await this.veterinariasRepository.findOne({
      where: { id },
      select: ['id', 'nombre', 'direccion', 'telefono', 'email', 'descripcion', 'rut', 'isActive', 'createdAt', 'updatedAt']
    });

    if (!veterinaria) {
      throw new NotFoundException(`Veterinaria with ID ${id} not found`);
    }

    return veterinaria;
  }

  async update(id: number, updateVeterinariaDto: UpdateVeterinariaDto): Promise<Veterinaria> {
    // Primero obtener la veterinaria actual
    const veterinaria = await this.veterinariasRepository.findOne({
      where: { id },
    });

    if (!veterinaria) {
      throw new NotFoundException(`Veterinaria with ID ${id} not found`);
    }

    // Actualizar solo los campos proporcionados
    if (updateVeterinariaDto.nombre !== undefined) {
      veterinaria.nombre = updateVeterinariaDto.nombre;
    }
    if (updateVeterinariaDto.direccion !== undefined) {
      veterinaria.direccion = updateVeterinariaDto.direccion;
    }
    if (updateVeterinariaDto.telefono !== undefined) {
      veterinaria.telefono = updateVeterinariaDto.telefono;
    }
    if (updateVeterinariaDto.email !== undefined) {
      veterinaria.email = updateVeterinariaDto.email;
    }
    if (updateVeterinariaDto.descripcion !== undefined) {
      veterinaria.descripcion = updateVeterinariaDto.descripcion;
    }
    if (updateVeterinariaDto.rut !== undefined) {
      veterinaria.rut = updateVeterinariaDto.rut;
    }
    if (updateVeterinariaDto.isActive !== undefined) {
      veterinaria.isActive = updateVeterinariaDto.isActive;
    }

    return this.veterinariasRepository.save(veterinaria);
  }

  async remove(id: number): Promise<void> {
    const veterinaria = await this.findOne(id);
    await this.veterinariasRepository.remove(veterinaria);
  }
}
