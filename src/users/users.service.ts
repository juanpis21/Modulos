import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesService } from '../roles/roles.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private rolesService: RolesService,
  ) {}

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
    
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    // Asignar roles si se proporcionan roleIds
    if (createUserDto.roleIds && createUserDto.roleIds.length > 0) {
      const roles = await this.rolesService.findByIds(createUserDto.roleIds);
      user.roles = roles;
    }

    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({ 
      relations: ['roles', 'pets'],
      select: ['id', 'username', 'email', 'fullName', 'phone', 'isActive', 'createdAt', 'updatedAt', 'roles', 'pets']
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['roles', 'pets'],
      select: ['id', 'username', 'email', 'fullName', 'phone', 'isActive', 'createdAt', 'updatedAt', 'roles', 'pets']
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { username },
      relations: ['roles', 'pets'],
    });
    
    if (!user) {
      return null;
    }
    
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['roles', 'pets'],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    // Primero obtener el usuario actual con relaciones
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['roles', 'pets'],
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

    // Asignar roles si se proporcionan roleIds
    if (updateUserDto.roleIds && updateUserDto.roleIds.length > 0) {
      const roles = await this.rolesService.findByIds(updateUserDto.roleIds);
      user.roles = roles;
    }

    // Actualizar solo los campos proporcionados
    Object.assign(user, updateUserDto);
    
    // Guardar cambios
    await this.usersRepository.save(user);
    
    // Devolver el usuario actualizado con relaciones desde la base de datos
    const updatedUser = await this.usersRepository.findOne({
      where: { id: user.id },
      relations: ['roles', 'pets'],
      select: ['id', 'username', 'email', 'fullName', 'phone', 'isActive', 'createdAt', 'updatedAt', 'roles', 'pets']
    });

    return updatedUser;
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }
}
