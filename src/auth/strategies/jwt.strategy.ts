import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    console.log('JWT Strategy - Payload recibido:', payload);
    
    const user = { 
      userId: payload.sub, 
      username: payload.username, 
      role: payload.role,  // Cambiado de roles a role
      roleId: payload.role?.id  // Agregar roleId directamente
    };
    
    console.log('JWT Strategy - User validado:', user);
    return user;
  }
}
