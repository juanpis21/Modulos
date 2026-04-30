import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../roles/entities/role.entity';
import { PermissionsService } from '../permissions/permissions.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    private permissionsService: PermissionsService,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Obtener el rol por defecto 'usuario' o usar el roleId proporcionado
    let roleId = createUserDto.roleId;
    if (!roleId) {
      const defaultRole = await this.rolesRepository.findOne({ where: { name: 'usuario' } });
      if (!defaultRole) {
        throw new NotFoundException('Default role "usuario" not found');
      }
      roleId = defaultRole.id;
    }

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      roleId,
    });

    const savedUser = await this.usersRepository.save(user);

    // Crear permisos por defecto para el nuevo usuario
    await this.permissionsService.createDefaultPermissions(savedUser.id);

    return savedUser;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['pets', 'role'],
      select: ['id', 'username', 'email', 'fullName', 'firstName', 'lastName', 'phone', 'documentType', 'documentNumber', 'age', 'address', 'avatar', 'roleId', 'isActive', 'createdAt', 'updatedAt'],
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['pets', 'role', 'role.modules'],
      select: ['id', 'username', 'email', 'fullName', 'firstName', 'lastName', 'phone', 'documentType', 'documentNumber', 'age', 'address', 'avatar', 'roleId', 'isActive', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByUsername(identifier: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: [
        { username: identifier },
        { email: identifier },
      ],
      relations: ['pets', 'role'],
      select: ['id', 'username', 'email', 'password', 'fullName', 'firstName', 'lastName', 'phone', 'documentType', 'documentNumber', 'age', 'address', 'avatar', 'roleId', 'isActive', 'createdAt', 'updatedAt'],
    });

    return user || null;
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['pets', 'role'],
      select: ['id', 'username', 'email', 'password', 'fullName', 'firstName', 'lastName', 'phone', 'documentType', 'documentNumber', 'age', 'address', 'avatar', 'roleId', 'isActive', 'createdAt', 'updatedAt'],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['pets', 'role'],
      select: ['id', 'username', 'email', 'fullName', 'firstName', 'lastName', 'phone', 'documentType', 'documentNumber', 'age', 'address', 'avatar', 'roleId', 'isActive', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.username || updateUserDto.email) {
      const existingUser = await this.usersRepository.findOne({
        where: [
          { username: updateUserDto.username },
          { email: updateUserDto.email },
        ],
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Username or email already exists');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    await this.usersRepository.save(user);

    const updatedUser = await this.usersRepository.findOne({
      where: { id: user.id },
      relations: ['pets', 'role'],
      select: ['id', 'username', 'email', 'fullName', 'firstName', 'lastName', 'phone', 'documentType', 'documentNumber', 'age', 'address', 'avatar', 'roleId', 'isActive', 'createdAt', 'updatedAt'],
    });

    return updatedUser;
  }

  async deactivate(id: number): Promise<void> {
    const user = await this.findOne(id);
    user.isActive = false;
    await this.usersRepository.save(user);
  }
}
