import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ModulesService } from './modules.service';
import { Module } from './entities/module.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('modules')
@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todos los módulos' })
  async findAll(): Promise<Module[]> {
    return this.modulesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener un módulo por ID' })
  async findOne(@Param('id') id: string): Promise<Module> {
    return this.modulesService.findOne(+id);
  }

  @Post('seed')
  @Public()
  @ApiOperation({ summary: 'Crear módulos iniciales' })
  async createInitialModules(): Promise<Module[]> {
    return this.modulesService.createInitialModules();
  }

  @Post('assign/:roleId')
  @Public()
  @ApiOperation({ summary: 'Asignar módulos a un rol' })
  async assignModulesToRole(
    @Param('roleId') roleId: string,
    @Body() body: { moduleNames: string[] }
  ): Promise<any> {
    return this.modulesService.assignModulesToRole(+roleId, body.moduleNames);
  }
}
