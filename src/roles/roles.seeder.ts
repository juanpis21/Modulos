import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class RolesSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(RolesSeeder.name);

  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) { }

  async onApplicationBootstrap(): Promise<void> {
    // 1. Crear roles base si no existen
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

    // 2. Asignar rol "usuario" a todos los usuarios que no tienen roleId
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
