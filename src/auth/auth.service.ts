import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PermissionsService } from '../permissions/permissions.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';

export interface AuthResponse {
  access_token: string;
  user: Omit<User, 'password'>;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private permissionsService: PermissionsService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);

    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { username, password } = loginDto;
    const user = await this.validateUser(username, password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Su cuenta está desactivada. Por favor, contacte al soporte.');
    }

    const payload = { 
      username: user.username, 
      sub: user.id, 
      role: user.role ?? 'usuario'
    };

    // Cargar usuario con roles y módulos
    const userWithRoles = await this.usersService.findOne(user.id);

    return {
      access_token: this.jwtService.sign(payload),
      user: userWithRoles,
    };
  }

  async checkStatus(user: any): Promise<AuthResponse> {
    const userWithRoles = await this.usersService.findOne(user.id);
    return {
      access_token: '', // No generamos nuevo token
      user: userWithRoles,
    };
  }
}
