import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission, ModuleName } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async findByUserId(userId: number): Promise<Permission[]> {
    return this.permissionRepository.find({
      where: { userId },
      select: ['id', 'moduleName', 'canAccess', 'canCreate', 'canRead', 'canUpdate', 'canDelete'],
    });
  }

  async hasPermission(userId: number, moduleName: ModuleName, action: string = 'canAccess'): Promise<boolean> {
    const permission = await this.permissionRepository.findOne({
      where: { userId, moduleName },
      select: ['canAccess', 'canCreate', 'canRead', 'canUpdate', 'canDelete'],
    });

    if (!permission) {
      return false;
    }

    return permission[action as keyof Permission] as boolean;
  }

  async createDefaultPermissions(userId: number): Promise<Permission[]> {
    const defaultModules = [
      ModuleName.INICIO,
      ModuleName.PERFIL_USUARIO,
      ModuleName.RECOVERY,
    ];

    const permissions: Permission[] = [];

    for (const moduleName of defaultModules) {
      const permission = this.permissionRepository.create({
        userId,
        moduleName,
        canAccess: true,
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
      });
      permissions.push(await this.permissionRepository.save(permission));
    }

    return permissions;
  }

  async updatePermission(userId: number, moduleName: ModuleName, updates: Partial<Permission>): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { userId, moduleName },
    });

    if (!permission) {
      const newPermission = this.permissionRepository.create({
        userId,
        moduleName,
        ...updates,
      });
      return this.permissionRepository.save(newPermission);
    }

    Object.assign(permission, updates);
    return this.permissionRepository.save(permission);
  }

  async grantModuleAccess(userId: number, moduleNames: ModuleName[]): Promise<void> {
    for (const moduleName of moduleNames) {
      const existing = await this.permissionRepository.findOne({
        where: { userId, moduleName },
      });

      if (!existing) {
        const permission = this.permissionRepository.create({
          userId,
          moduleName,
          canAccess: true,
          canCreate: true,
          canRead: true,
          canUpdate: true,
          canDelete: true,
        });
        await this.permissionRepository.save(permission);
      } else {
        existing.canAccess = true;
        await this.permissionRepository.save(existing);
      }
    }
  }

  async revokeModuleAccess(userId: number, moduleNames: ModuleName[]): Promise<void> {
    for (const moduleName of moduleNames) {
      const permission = await this.permissionRepository.findOne({
        where: { userId, moduleName },
      });

      if (permission) {
        permission.canAccess = false;
        await this.permissionRepository.save(permission);
      }
    }
  }
}
