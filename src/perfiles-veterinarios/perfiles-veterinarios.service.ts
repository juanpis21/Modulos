import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PerfilVeterinario } from './entities/perfil-veterinario.entity';
import { CreatePerfilVeterinarioDto } from './dto/create-perfil-veterinario.dto';
import { UpdatePerfilVeterinarioDto } from './dto/update-perfil-veterinario.dto';
import { UsersService } from '../users/users.service';
import { VeterinariasService } from '../veterinarias/veterinarias.service';

@Injectable()
export class PerfilesVeterinariosService {
  constructor(
    @InjectRepository(PerfilVeterinario)
    private perfilesVeterinariosRepository: Repository<PerfilVeterinario>,
    private usersService: UsersService,
    private veterinariasService: VeterinariasService,
  ) {}

  async create(createPerfilVeterinarioDto: CreatePerfilVeterinarioDto): Promise<PerfilVeterinario> {
    // Verificar si el usuario existe
    const usuario = await this.usersService.findOne(createPerfilVeterinarioDto.usuarioId);
    if (!usuario) {
      throw new NotFoundException(`Usuario with ID ${createPerfilVeterinarioDto.usuarioId} not found`);
    }

    // Verificar si el usuario ya tiene un perfil veterinario
    const existingPerfil = await this.perfilesVeterinariosRepository.findOne({
      where: { usuario: { id: createPerfilVeterinarioDto.usuarioId }, isActive: true },
      relations: ['usuario']
    });

    if (existingPerfil) {
      throw new ConflictException('Este usuario ya tiene un perfil veterinario activo');
    }

    // Verificar si la matrícula ya existe
    const existingMatricula = await this.perfilesVeterinariosRepository.findOne({
      where: { matricula: createPerfilVeterinarioDto.matricula, isActive: true }
    });

    if (existingMatricula) {
      throw new ConflictException('Esta matrícula profesional ya está registrada');
    }

    // Verificar veterinaria principal si se proporciona
    let veterinariaPrincipal = null;
    if (createPerfilVeterinarioDto.veterinariaPrincipalId) {
      veterinariaPrincipal = await this.veterinariasService.findOne(createPerfilVeterinarioDto.veterinariaPrincipalId);
      if (!veterinariaPrincipal) {
        throw new NotFoundException(`Veterinaria with ID ${createPerfilVeterinarioDto.veterinariaPrincipalId} not found`);
      }
    }

    const perfilVeterinario = this.perfilesVeterinariosRepository.create({
      ...createPerfilVeterinarioDto,
      usuario,
      veterinariaPrincipal,
    });

    return this.perfilesVeterinariosRepository.save(perfilVeterinario);
  }

  async findAll(): Promise<PerfilVeterinario[]> {
    return this.perfilesVeterinariosRepository.find({ 
      relations: ['usuario', 'veterinariaPrincipal', 'citas'],
      select: ['id', 'especialidad', 'matricula', 'aniosExperiencia', 'universidad', 'telefonoProfesional', 'emailProfesional', 'biografia', 'isActive', 'createdAt', 'updatedAt', 'usuario', 'veterinariaPrincipal', 'citas']
    });
  }

  async findOne(id: number): Promise<PerfilVeterinario> {
    const perfilVeterinario = await this.perfilesVeterinariosRepository.findOne({
      where: { id },
      relations: ['usuario', 'veterinariaPrincipal', 'citas'],
      select: ['id', 'especialidad', 'matricula', 'aniosExperiencia', 'universidad', 'telefonoProfesional', 'emailProfesional', 'biografia', 'isActive', 'createdAt', 'updatedAt', 'usuario', 'veterinariaPrincipal', 'citas']
    });

    if (!perfilVeterinario) {
      throw new NotFoundException(`PerfilVeterinario with ID ${id} not found`);
    }

    return perfilVeterinario;
  }

  async findByUsuario(usuarioId: number): Promise<PerfilVeterinario[]> {
    return this.perfilesVeterinariosRepository.find({
      where: { usuario: { id: usuarioId }, isActive: true },
      relations: ['usuario', 'veterinariaPrincipal'],
      select: ['id', 'especialidad', 'matricula', 'aniosExperiencia', 'universidad', 'telefonoProfesional', 'emailProfesional', 'biografia', 'isActive', 'createdAt', 'updatedAt', 'usuario', 'veterinariaPrincipal']
    });
  }

  async findByVeterinaria(veterinariaId: number): Promise<PerfilVeterinario[]> {
    return this.perfilesVeterinariosRepository.find({
      where: { veterinariaPrincipal: { id: veterinariaId }, isActive: true },
      relations: ['usuario', 'veterinariaPrincipal'],
      select: ['id', 'especialidad', 'matricula', 'aniosExperiencia', 'universidad', 'telefonoProfesional', 'emailProfesional', 'biografia', 'isActive', 'createdAt', 'updatedAt', 'usuario', 'veterinariaPrincipal'],
      order: { especialidad: 'ASC' }
    });
  }

  async findByEspecialidad(especialidad: string): Promise<PerfilVeterinario[]> {
    return this.perfilesVeterinariosRepository.find({
      where: { especialidad, isActive: true },
      relations: ['usuario', 'veterinariaPrincipal'],
      select: ['id', 'especialidad', 'matricula', 'aniosExperiencia', 'universidad', 'telefonoProfesional', 'emailProfesional', 'biografia', 'isActive', 'createdAt', 'updatedAt', 'usuario', 'veterinariaPrincipal'],
      order: { aniosExperiencia: 'DESC' }
    });
  }

  async update(id: number, updatePerfilVeterinarioDto: UpdatePerfilVeterinarioDto): Promise<PerfilVeterinario> {
    // Primero obtener el perfil veterinario actual con relaciones
    const perfilVeterinario = await this.perfilesVeterinariosRepository.findOne({
      where: { id },
      relations: ['usuario', 'veterinariaPrincipal']
    });

    if (!perfilVeterinario) {
      throw new NotFoundException(`PerfilVeterinario with ID ${id} not found`);
    }

    // Verificar usuario si se proporciona
    if (updatePerfilVeterinarioDto.usuarioId && updatePerfilVeterinarioDto.usuarioId !== perfilVeterinario.usuario.id) {
      const usuario = await this.usersService.findOne(updatePerfilVeterinarioDto.usuarioId);
      if (!usuario) {
        throw new NotFoundException(`Usuario with ID ${updatePerfilVeterinarioDto.usuarioId} not found`);
      }
      
      // Verificar si el nuevo usuario ya tiene un perfil veterinario
      const existingPerfil = await this.perfilesVeterinariosRepository.findOne({
        where: { usuario: { id: updatePerfilVeterinarioDto.usuarioId }, isActive: true },
        relations: ['usuario']
      });

      if (existingPerfil && existingPerfil.id !== id) {
        throw new ConflictException('Este usuario ya tiene un perfil veterinario activo');
      }
      
      perfilVeterinario.usuario = usuario;
    }

    // Verificar veterinaria principal si se proporciona
    if (updatePerfilVeterinarioDto.veterinariaPrincipalId !== undefined) {
      if (updatePerfilVeterinarioDto.veterinariaPrincipalId === null) {
        perfilVeterinario.veterinariaPrincipal = null;
      } else {
        const veterinaria = await this.veterinariasService.findOne(updatePerfilVeterinarioDto.veterinariaPrincipalId);
        if (!veterinaria) {
          throw new NotFoundException(`Veterinaria with ID ${updatePerfilVeterinarioDto.veterinariaPrincipalId} not found`);
        }
        perfilVeterinario.veterinariaPrincipal = veterinaria;
      }
    }

    // Verificar si la matrícula ya existe (si se está actualizando)
    if (updatePerfilVeterinarioDto.matricula && updatePerfilVeterinarioDto.matricula !== perfilVeterinario.matricula) {
      const existingMatricula = await this.perfilesVeterinariosRepository.findOne({
        where: { matricula: updatePerfilVeterinarioDto.matricula, isActive: true }
      });

      if (existingMatricula && existingMatricula.id !== id) {
        throw new ConflictException('Esta matrícula profesional ya está registrada');
      }
    }

    // Actualizar solo los campos proporcionados
    if (updatePerfilVeterinarioDto.especialidad !== undefined) {
      perfilVeterinario.especialidad = updatePerfilVeterinarioDto.especialidad;
    }
    if (updatePerfilVeterinarioDto.matricula !== undefined) {
      perfilVeterinario.matricula = updatePerfilVeterinarioDto.matricula;
    }
    if (updatePerfilVeterinarioDto.aniosExperiencia !== undefined) {
      perfilVeterinario.aniosExperiencia = updatePerfilVeterinarioDto.aniosExperiencia;
    }
    if (updatePerfilVeterinarioDto.universidad !== undefined) {
      perfilVeterinario.universidad = updatePerfilVeterinarioDto.universidad;
    }
    if (updatePerfilVeterinarioDto.telefonoProfesional !== undefined) {
      perfilVeterinario.telefonoProfesional = updatePerfilVeterinarioDto.telefonoProfesional;
    }
    if (updatePerfilVeterinarioDto.emailProfesional !== undefined) {
      perfilVeterinario.emailProfesional = updatePerfilVeterinarioDto.emailProfesional;
    }
    if (updatePerfilVeterinarioDto.biografia !== undefined) {
      perfilVeterinario.biografia = updatePerfilVeterinarioDto.biografia;
    }
    if (updatePerfilVeterinarioDto.isActive !== undefined) {
      perfilVeterinario.isActive = updatePerfilVeterinarioDto.isActive;
    }

    // Guardar cambios
    await this.perfilesVeterinariosRepository.save(perfilVeterinario);
    
    // Devolver el perfil veterinario actualizado con relaciones desde la base de datos
    const updatedPerfilVeterinario = await this.perfilesVeterinariosRepository.findOne({
      where: { id: perfilVeterinario.id },
      relations: ['usuario', 'veterinariaPrincipal', 'citas'],
      select: ['id', 'especialidad', 'matricula', 'aniosExperiencia', 'universidad', 'telefonoProfesional', 'emailProfesional', 'biografia', 'isActive', 'createdAt', 'updatedAt', 'usuario', 'veterinariaPrincipal', 'citas']
    });

    return updatedPerfilVeterinario;
  }

  async remove(id: number): Promise<void> {
    const perfilVeterinario = await this.findOne(id);
    await this.perfilesVeterinariosRepository.remove(perfilVeterinario);
  }
}
