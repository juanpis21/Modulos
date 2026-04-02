import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proveedor } from './entities/proveedor.entity';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';

@Injectable()
export class ProveedoresService {
  constructor(
    @InjectRepository(Proveedor)
    private proveedoresRepository: Repository<Proveedor>,
  ) {}

  async create(createProveedorDto: CreateProveedorDto): Promise<Proveedor> {
    // Verificar si ya existe un proveedor con el mismo RUT
    const existingProveedor = await this.proveedoresRepository.findOne({
      where: { rut: createProveedorDto.rut },
    });
    if (existingProveedor) {
      throw new ConflictException('Proveedor with this RUT already exists');
    }

    const proveedor = this.proveedoresRepository.create(createProveedorDto);
    return this.proveedoresRepository.save(proveedor);
  }

  async findAll(): Promise<Proveedor[]> {
    return this.proveedoresRepository.find({ 
      select: ['id', 'nombre', 'rut', 'contacto', 'telefono', 'email', 'direccion', 'ciudad', 'pais', 'condicionesPago', 'tiempoEntregaDias', 'notas', 'isActive', 'createdAt', 'updatedAt']
    });
  }

  async findOne(id: number): Promise<Proveedor> {
    const proveedor = await this.proveedoresRepository.findOne({ where: { id } });

    if (!proveedor) {
      throw new NotFoundException(`Proveedor with ID ${id} not found`);
    }

    return proveedor;
  }

  async update(id: number, updateProveedorDto: UpdateProveedorDto): Promise<Proveedor> {
    const proveedor = await this.findOne(id);

    // Verificar si el RUT ya existe (si se está actualizando)
    if (updateProveedorDto.rut && updateProveedorDto.rut !== proveedor.rut) {
      const existingProveedor = await this.proveedoresRepository.findOne({
        where: { rut: updateProveedorDto.rut },
      });
      if (existingProveedor) {
        throw new ConflictException('Proveedor with this RUT already exists');
      }
    }

    Object.assign(proveedor, updateProveedorDto);
    return this.proveedoresRepository.save(proveedor);
  }

  async remove(id: number): Promise<void> {
    const proveedor = await this.findOne(id);
    await this.proveedoresRepository.remove(proveedor);
  }
}
