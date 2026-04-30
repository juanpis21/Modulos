import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { Permission, ModuleName } from './entities/permission.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('permissions')
@Controller('permissions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get('user/:userId')
  @ApiOperation({ summary: 'Obtener permisos de un usuario' })
  async getUserPermissions(@Param('userId') userId: string): Promise<Permission[]> {
    return this.permissionsService.findByUserId(+userId);
  }

  @Get('my-permissions')
  @ApiOperation({ summary: 'Obtener mis permisos' })
  async getMyPermissions(@Request() req): Promise<Permission[]> {
    return this.permissionsService.findByUserId(req.user.userId);
  }

  @Get('check/:moduleName')
  @ApiOperation({ summary: 'Verificar si tengo acceso a un módulo' })
  async checkPermission(@Request() req, @Param('moduleName') moduleName: ModuleName): Promise<{ hasAccess: boolean }> {
    const hasAccess = await this.permissionsService.hasPermission(req.user.userId, moduleName, 'canAccess');
    return { hasAccess };
  }

  @Post('default/:userId')
  @ApiOperation({ summary: 'Crear permisos por defecto para un usuario' })
  async createDefaultPermissions(@Param('userId') userId: string): Promise<Permission[]> {
    return this.permissionsService.createDefaultPermissions(+userId);
  }

  @Put('update/:userId/:moduleName')
  @ApiOperation({ summary: 'Actualizar permiso de un módulo' })
  async updatePermission(
    @Param('userId') userId: string,
    @Param('moduleName') moduleName: ModuleName,
    @Body() updates: Partial<Permission>,
  ): Promise<Permission> {
    return this.permissionsService.updatePermission(+userId, moduleName, updates);
  }

  @Post('grant/:userId')
  @ApiOperation({ summary: 'Otorgar acceso a módulos' })
  async grantModuleAccess(
    @Param('userId') userId: string,
    @Body() body: { moduleNames: ModuleName[] },
  ): Promise<void> {
    return this.permissionsService.grantModuleAccess(+userId, body.moduleNames);
  }

  @Post('revoke/:userId')
  @ApiOperation({ summary: 'Revocar acceso a módulos' })
  async revokeModuleAccess(
    @Param('userId') userId: string,
    @Body() body: { moduleNames: ModuleName[] },
  ): Promise<void> {
    return this.permissionsService.revokeModuleAccess(+userId, body.moduleNames);
  }
}
