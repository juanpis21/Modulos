import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { User } from '../users/entities/user.entity';
import { Module } from '../modules/entities/module.entity';

@Injectable()
export class RolesSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(RolesSeeder.name);

  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Module)
    private readonly moduleRepository: Repository<Module>,
  ) { }

  async onApplicationBootstrap(): Promise<void> {
    // 1. Crear módulos si no existen
    const modulesData = [
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
      { name: 'publicaciones', description: 'Módulo de publicaciones' },
    ];

    for (const moduleData of modulesData) {
      const existing = await this.moduleRepository.findOne({
        where: { name: moduleData.name },
      });
      if (!existing) {
        await this.moduleRepository.save(this.moduleRepository.create(moduleData));
        this.logger.log(`✅ Módulo creado: "${moduleData.name}"`);
      }
    }

    this.logger.log('Módulos verificados correctamente.');

    // 2. Crear roles base si no existen
    const rolesBase = [
      { name: 'admin', description: 'Administrador del sistema' },
      { name: 'usuario', description: 'Usuario estándar de la plataforma' },
      { name: 'veterinario', description: 'Profesional veterinario' },
    ];

    for (const roleData of rolesBase) {
      const existe = await this.rolesRepository.findOne({
        where: { name: roleData.name },
      });

      if (!existe) {
        await this.rolesRepository.save(this.rolesRepository.create(roleData));
        this.logger.log(`✅ Rol creado: "${roleData.name}"`);
      }
    }

    this.logger.log('Roles base verificados correctamente.');

    // 3. Asignar módulos a los roles
    const allModules = await this.moduleRepository.find();

    // Admin tiene acceso a todos los módulos
    const adminRole = await this.rolesRepository.findOne({ where: { name: 'admin' } });
    if (adminRole) {
      const roleWithModules = await this.rolesRepository.findOne({ where: { id: adminRole.id }, relations: ['modules'] });
      if (roleWithModules && roleWithModules.modules.length === 0) {
        roleWithModules.modules = allModules;
        await this.rolesRepository.save(roleWithModules);
        this.logger.log(`✅ Módulos asignados al rol "admin"`);
      }
    }

    // Usuario tiene acceso a módulos básicos
    const usuarioRole = await this.rolesRepository.findOne({ where: { name: 'usuario' } });
    if (usuarioRole) {
      const roleWithModules = await this.rolesRepository.findOne({ where: { id: usuarioRole.id }, relations: ['modules'] });
      if (roleWithModules) {
        const usuarioModuleNames = ['inicio', 'sobre-nosotros', 'adopcion', 'tienda', 'servicios', 'perfil-usuario', 'calificacion', 'recovery', 'publicaciones'];
        const currentModuleNames = roleWithModules.modules.map(m => m.name);
        
        // Siempre actualizar para asegurar que tenga publicaciones
        roleWithModules.modules = allModules.filter(m => usuarioModuleNames.includes(m.name));
        await this.rolesRepository.save(roleWithModules);
        this.logger.log(`✅ Módulos actualizados al rol "usuario" (incluyendo publicaciones)`);
      }
    }

    // Veterinario tiene acceso a módulos de vet + básicos
    const vetRole = await this.rolesRepository.findOne({ where: { name: 'veterinario' } });
    if (vetRole) {
      const roleWithModules = await this.rolesRepository.findOne({ where: { id: vetRole.id }, relations: ['modules'] });
      if (roleWithModules && roleWithModules.modules.length === 0) {
        const vetModuleNames = ['inicio', 'sobre-nosotros', 'adopcion', 'tienda', 'servicios', 'perfil-usuario', 'perfil-veterinario', 'veterinario', 'calificacion', 'recovery'];
        roleWithModules.modules = allModules.filter(m => vetModuleNames.includes(m.name));
        await this.rolesRepository.save(roleWithModules);
        this.logger.log(`✅ Módulos asignados al rol "veterinario"`);
      }
    }

    // 4. Asignar rol "usuario" a todos los usuarios que no tienen roleId
    const rolUsuario = await this.rolesRepository.findOne({ where: { name: 'usuario' } });
    if (!rolUsuario) return;

    const usuariosSinRol = await this.usersRepository.find({
      where: { roleId: null },
    });

    let asignados = 0;
    for (const user of usuariosSinRol) {
      user.roleId = rolUsuario.id;
      await this.usersRepository.save(user);
      asignados++;
    }

    if (asignados > 0) {
      this.logger.log(`🔑 Se asignó el rol "usuario" a ${asignados} usuario(s) sin rol.`);
    }
  }
}
