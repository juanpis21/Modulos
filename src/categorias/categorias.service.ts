import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private categoriasRepository: Repository<Categoria>,
  ) {}

  async create(createCategoriaDto: CreateCategoriaDto): Promise<Categoria> {
    // Verificar si ya existe una categoría con el mismo código
    const existingCategoria = await this.categoriasRepository.findOne({
      where: { codigo: createCategoriaDto.codigo },
    });
    if (existingCategoria) {
      throw new ConflictException('Categoria with this codigo already exists');
    }

    const categoria = this.categoriasRepository.create(createCategoriaDto);
    return this.categoriasRepository.save(categoria);
  }

  async findAll(): Promise<Categoria[]> {
    return this.categoriasRepository.find({ 
      select: ['id', 'nombre', 'descripcion', 'codigo', 'color', 'isActive', 'createdAt', 'updatedAt']
    });
  }

  async findOne(id: number): Promise<Categoria> {
    const categoria = await this.categoriasRepository.findOne({ where: { id } });

    if (!categoria) {
      throw new NotFoundException(`Categoria with ID ${id} not found`);
    }

    return categoria;
  }

  async update(id: number, updateCategoriaDto: UpdateCategoriaDto): Promise<Categoria> {
    const categoria = await this.findOne(id);

    // Verificar si el código ya existe (si se está actualizando)
    if (updateCategoriaDto.codigo && updateCategoriaDto.codigo !== categoria.codigo) {
      const existingCategoria = await this.categoriasRepository.findOne({
        where: { codigo: updateCategoriaDto.codigo },
      });
      if (existingCategoria) {
        throw new ConflictException('Categoria with this codigo already exists');
      }
    }

    Object.assign(categoria, updateCategoriaDto);
    return this.categoriasRepository.save(categoria);
  }

  async remove(id: number): Promise<void> {
    const categoria = await this.findOne(id);
    await this.categoriasRepository.remove(categoria);
  }
}
