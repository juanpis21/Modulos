import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from './entities/role.entity';
import { RolesSeeder } from './roles.seeder';
import { User } from '../users/entities/user.entity';
import { Module as ModuleEntity } from '../modules/entities/module.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, User, ModuleEntity])],
  controllers: [RolesController],
  providers: [RolesService, RolesSeeder],
  exports: [RolesService],
})
export class RolesModule {}
