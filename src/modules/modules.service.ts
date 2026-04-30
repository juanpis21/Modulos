import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Module } from './entities/module.entity';
import { Role } from '../roles/entities/role.entity';

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(Module)
    private moduleRepository: Repository<Module>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async findAll(): Promise<Module[]> {
    return this.moduleRepository.find({
      relations: ['roles'],
    });
  }

  async findOne(id: number): Promise<Module> {
    return this.moduleRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
  }

  async findByName(name: string): Promise<Module> {
    return this.moduleRepository.findOne({
      where: { name },
      relations: ['roles'],
    });
  }

  async createInitialModules(): Promise<Module[]> {
    const modules = [
      { name: 'inicio', description: 'Módulo de inicio' },
      { name: 'sobre-nosotros', description: 'Módulo de sobre nosotros' },
      { name: 'adopcion', description: 'Módulo de adopción' },
      { name: 'tienda', description: 'Módulo de tienda' },
      { name: 'reporte', description: 'Módulo de reportes' },
      { name: 'calificacion', description: 'Módulo de calificaciones' },
      { name: 'veterinario', description: 'Módulo de veterinario' },
      { name: 'servicios', description: 'Módulo de servicios' },
      { name: 'pasarela-pagos', description: 'Módulo de pasarela de pagos' },
      { name: 'perfil-usuario', description: 'Módulo de perfil de usuario' },
      { name: 'perfil-veterinario', description: 'Módulo de perfil de veterinario' },
      { name: 'panel-admin', description: 'Módulo de panel de administrador' },
      { name: 'recovery', description: 'Módulo de recuperación de contraseña' },
    ];

    const createdModules: Module[] = [];

    for (const moduleData of modules) {
      const existing = await this.moduleRepository.findOne({
        where: { name: moduleData.name },
      });

      if (!existing) {
        const module = this.moduleRepository.create(moduleData);
        createdModules.push(await this.moduleRepository.save(module));
      }
    }

    return createdModules;
  }

  async assignModulesToRole(roleId: number, moduleNames: string[]): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['modules'],
    });

    if (!role) {
      throw new Error(`Rol con ID ${roleId} no encontrado`);
    }

    const modules = await this.moduleRepository.find({
      where: moduleNames.map(name => ({ name })),
    });

    role.modules = modules;
    return this.roleRepository.save(role);
  }
}
