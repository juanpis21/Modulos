import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { PerfilesVeterinariosService } from './perfiles-veterinarios.service';
import { CreatePerfilVeterinarioDto } from './dto/create-perfil-veterinario.dto';
import { UpdatePerfilVeterinarioDto } from './dto/update-perfil-veterinario.dto';
import { PerfilVeterinario } from './entities/perfil-veterinario.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('perfiles-veterinarios')
@Controller('perfiles-veterinarios')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PerfilesVeterinariosController {
  constructor(private readonly perfilesVeterinariosService: PerfilesVeterinariosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo perfil veterinario' })
  @ApiResponse({ status: 201, description: 'Perfil veterinario creado exitosamente', type: PerfilVeterinario })
  @ApiResponse({ status: 404, description: 'Usuario o veterinaria no encontrada' })
  @ApiResponse({ status: 409, description: 'El usuario ya tiene un perfil veterinario o la matrícula ya está registrada' })
  create(@Body() createPerfilVeterinarioDto: CreatePerfilVeterinarioDto) {
    return this.perfilesVeterinariosService.create(createPerfilVeterinarioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los perfiles veterinarios' })
  @ApiResponse({ status: 200, description: 'Lista de perfiles veterinarios', type: [PerfilVeterinario] })
  findAll() {
    return this.perfilesVeterinariosService.findAll();
  }

  @Get('usuario/:usuarioId')
  @ApiOperation({ summary: 'Obtener perfiles veterinarios por usuario' })
  @ApiParam({ name: 'usuarioId', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de perfiles veterinarios del usuario', type: [PerfilVeterinario] })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findByUsuario(@Param('usuarioId') usuarioId: string) {
    return this.perfilesVeterinariosService.findByUsuario(+usuarioId);
  }

  @Get('veterinaria/:veterinariaId')
  @ApiOperation({ summary: 'Obtener perfiles veterinarios por veterinaria' })
  @ApiParam({ name: 'veterinariaId', description: 'ID de la veterinaria' })
  @ApiResponse({ status: 200, description: 'Lista de perfiles veterinarios de la veterinaria', type: [PerfilVeterinario] })
  @ApiResponse({ status: 404, description: 'Veterinaria no encontrada' })
  findByVeterinaria(@Param('veterinariaId') veterinariaId: string) {
    return this.perfilesVeterinariosService.findByVeterinaria(+veterinariaId);
  }

  @Get('especialidad/:especialidad')
  @ApiOperation({ summary: 'Obtener perfiles veterinarios por especialidad' })
  @ApiParam({ name: 'especialidad', description: 'Especialidad del veterinario' })
  @ApiResponse({ status: 200, description: 'Lista de perfiles veterinarios por especialidad', type: [PerfilVeterinario] })
  findByEspecialidad(@Param('especialidad') especialidad: string) {
    return this.perfilesVeterinariosService.findByEspecialidad(especialidad);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un perfil veterinario por ID' })
  @ApiParam({ name: 'id', description: 'ID del perfil veterinario' })
  @ApiResponse({ status: 200, description: 'Perfil veterinario encontrado', type: PerfilVeterinario })
  @ApiResponse({ status: 404, description: 'Perfil veterinario no encontrado' })
  findOne(@Param('id') id: string) {
    return this.perfilesVeterinariosService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un perfil veterinario' })
  @ApiParam({ name: 'id', description: 'ID del perfil veterinario' })
  @ApiResponse({ status: 200, description: 'Perfil veterinario actualizado', type: PerfilVeterinario })
  @ApiResponse({ status: 404, description: 'Perfil veterinario, usuario o veterinaria no encontrada' })
  @ApiResponse({ status: 409, description: 'El usuario ya tiene un perfil veterinario o la matrícula ya está registrada' })
  update(@Param('id') id: string, @Body() updatePerfilVeterinarioDto: UpdatePerfilVeterinarioDto) {
    return this.perfilesVeterinariosService.update(+id, updatePerfilVeterinarioDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un perfil veterinario' })
  @ApiParam({ name: 'id', description: 'ID del perfil veterinario' })
  @ApiResponse({ status: 204, description: 'Perfil veterinario eliminado' })
  @ApiResponse({ status: 404, description: 'Perfil veterinario no encontrado' })
  remove(@Param('id') id: string) {
    return this.perfilesVeterinariosService.remove(+id);
  }
}
