import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pet } from './entities/pet.entity';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(Pet)
    private petsRepository: Repository<Pet>,
  ) {}

  async create(createPetDto: CreatePetDto): Promise<Pet> {
    const pet = this.petsRepository.create(createPetDto);
    return this.petsRepository.save(pet);
  }

  async findAll(): Promise<Pet[]> {
    return this.petsRepository.find({ 
      relations: ['owner'],
      select: ['id', 'name', 'species', 'breed', 'age', 'gender', 'color', 'weight', 'description', 'ownerId', 'isActive', 'createdAt', 'updatedAt', 'owner']
    });
  }

  async findOne(id: number): Promise<Pet> {
    const pet = await this.petsRepository.findOne({
      where: { id },
      relations: ['owner'],
      select: ['id', 'name', 'species', 'breed', 'age', 'gender', 'color', 'weight', 'description', 'ownerId', 'isActive', 'createdAt', 'updatedAt', 'owner']
    });

    if (!pet) {
      throw new NotFoundException(`Pet with ID ${id} not found`);
    }

    return pet;
  }

  async findByOwnerId(ownerId: number): Promise<Pet[]> {
    return this.petsRepository.find({
      where: { ownerId },
      relations: ['owner'],
      select: ['id', 'name', 'species', 'breed', 'age', 'gender', 'color', 'weight', 'description', 'ownerId', 'isActive', 'createdAt', 'updatedAt', 'owner']
    });
  }

  async update(id: number, updatePetDto: UpdatePetDto): Promise<Pet> {
    // Primero obtener la mascota actual con relaciones
    const pet = await this.petsRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!pet) {
      throw new NotFoundException(`Pet with ID ${id} not found`);
    }

    // Actualizar solo los campos proporcionados
    if (updatePetDto.name !== undefined) {
      pet.name = updatePetDto.name;
    }
    if (updatePetDto.species !== undefined) {
      pet.species = updatePetDto.species;
    }
    if (updatePetDto.breed !== undefined) {
      pet.breed = updatePetDto.breed;
    }
    if (updatePetDto.age !== undefined) {
      pet.age = updatePetDto.age;
    }
    if (updatePetDto.gender !== undefined) {
      pet.gender = updatePetDto.gender;
    }
    if (updatePetDto.color !== undefined) {
      pet.color = updatePetDto.color;
    }
    if (updatePetDto.weight !== undefined) {
      pet.weight = updatePetDto.weight;
    }
    if (updatePetDto.description !== undefined) {
      pet.description = updatePetDto.description;
    }
    if (updatePetDto.ownerId !== undefined) {
      pet.ownerId = updatePetDto.ownerId;
    }
    if (updatePetDto.isActive !== undefined) {
      pet.isActive = updatePetDto.isActive;
    }

    // Guardar cambios
    await this.petsRepository.save(pet);
    
    // Devolver la mascota actualizada con relaciones desde la base de datos
    const updatedPet = await this.petsRepository.findOne({
      where: { id: pet.id },
      relations: ['owner'],
      select: ['id', 'name', 'species', 'breed', 'age', 'gender', 'color', 'weight', 'description', 'ownerId', 'isActive', 'createdAt', 'updatedAt', 'owner']
    });

    return updatedPet;
  }

  async remove(id: number): Promise<void> {
    const pet = await this.findOne(id);
    await this.petsRepository.remove(pet);
  }
}
