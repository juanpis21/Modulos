import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: any) {
    console.log('JwtAuthGuard - Verificando acceso...');
    
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    console.log('JwtAuthGuard - Es público:', isPublic);
    
    if (isPublic) {
      return true;
    }
    
    const result = super.canActivate(context);
    console.log('JwtAuthGuard - Resultado canActivate:', result);
    return result;
  }
}
