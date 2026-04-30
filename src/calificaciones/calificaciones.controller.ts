import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  UseGuards,
  Request
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { CalificacionesService } from './calificaciones.service';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { UpdateCalificacionDto } from './dto/update-calificacion.dto';
import { Calificacion } from './entities/calificacion.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('calificaciones')
@Controller('calificaciones')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CalificacionesController {
  constructor(private readonly calificacionesService: CalificacionesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva calificación' })
  @ApiResponse({ status: 201, description: 'Calificación creada exitosamente', type: Calificacion })
  create(@Body() createCalificacionDto: CreateCalificacionDto, @Request() req) {
    // 1. Prioridad al usuarioId enviado en el body (para pruebas manuales)
    // 2. Fallback al userId del token JWT (estándar de seguridad)
    const usuarioId = createCalificacionDto.usuarioId || req.user?.userId || req.user?.id;
    return this.calificacionesService.create(usuarioId, createCalificacionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las calificaciones aprobadas' })
  @ApiResponse({ status: 200, description: 'Lista de calificaciones', type: [Calificacion] })
  findAll() {
    return this.calificacionesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una calificación por ID' })
  @ApiParam({ name: 'id', description: 'ID de la calificación' })
  @ApiResponse({ status: 200, description: 'Calificación encontrada', type: Calificacion })
  @ApiResponse({ status: 404, description: 'Calificación no encontrada' })
  findOne(@Param('id') id: string) {
    return this.calificacionesService.findOne(+id);
  }

  @Get('servicio/:servicioId')
  @ApiOperation({ summary: 'Obtener calificaciones por servicio' })
  @ApiParam({ name: 'servicioId', description: 'ID del servicio' })
  @ApiResponse({ status: 200, description: 'Calificaciones del servicio', type: [Calificacion] })
  findByServicio(@Param('servicioId') servicioId: string) {
    return this.calificacionesService.findByServicio(+servicioId);
  }

  @Get('usuario/:usuarioId')
  @ApiOperation({ summary: 'Obtener calificaciones por usuario' })
  @ApiParam({ name: 'usuarioId', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Calificaciones del usuario', type: [Calificacion] })
  findByUsuario(@Param('usuarioId') usuarioId: string) {
    return this.calificacionesService.findByUsuario(+usuarioId);
  }

  @Get('veterinario/:veterinarioId')
  @ApiOperation({ summary: 'Obtener calificaciones por veterinario' })
  @ApiParam({ name: 'veterinarioId', description: 'ID del veterinario' })
  @ApiResponse({ status: 200, description: 'Calificaciones del veterinario', type: [Calificacion] })
  findByVeterinario(@Param('veterinarioId') veterinarioId: string) {
    return this.calificacionesService.findByVeterinario(+veterinarioId);
  }

  @Get('mis-calificaciones')
  @ApiOperation({ summary: 'Obtener mis calificaciones' })
  @ApiResponse({ status: 200, description: 'Mis calificaciones', type: [Calificacion] })
  findMisCalificaciones(@Request() req) {
    return this.calificacionesService.findByUsuario(req.user.id);
  }

  @Get('pendientes')
  @ApiOperation({ summary: 'Obtener calificaciones pendientes de aprobación' })
  @ApiResponse({ status: 200, description: 'Calificaciones pendientes', type: [Calificacion] })
  getCalificacionesPendientes() {
    return this.calificacionesService.getCalificacionesPendientes();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una calificación' })
  @ApiParam({ name: 'id', description: 'ID de la calificación' })
  @ApiResponse({ status: 200, description: 'Calificación actualizada', type: Calificacion })
  @ApiResponse({ status: 404, description: 'Calificación no encontrada' })
  update(@Param('id') id: string, @Body() updateCalificacionDto: UpdateCalificacionDto) {
    return this.calificacionesService.update(+id, updateCalificacionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una calificación' })
  @ApiParam({ name: 'id', description: 'ID de la calificación' })
  @ApiResponse({ status: 200, description: 'Calificación eliminada' })
  @ApiResponse({ status: 404, description: 'Calificación no encontrada' })
  remove(@Param('id') id: string) {
    return this.calificacionesService.remove(+id);
  }

  // Endpoints de estadísticas
  @Get('estadisticas/servicio/:servicioId')
  @ApiOperation({ summary: 'Obtener estadísticas de un servicio' })
  @ApiParam({ name: 'servicioId', description: 'ID del servicio' })
  @ApiResponse({ status: 200, description: 'Estadísticas del servicio' })
  getEstadisticasPorServicio(@Param('servicioId') servicioId: string) {
    return this.calificacionesService.getEstadisticasPorServicio(+servicioId);
  }

  @Get('estadisticas/veterinario/:veterinarioId')
  @ApiOperation({ summary: 'Obtener estadísticas de un veterinario' })
  @ApiParam({ name: 'veterinarioId', description: 'ID del veterinario' })
  @ApiResponse({ status: 200, description: 'Estadísticas del veterinario' })
  getEstadisticasPorVeterinario(@Param('veterinarioId') veterinarioId: string) {
    return this.calificacionesService.getEstadisticasPorVeterinario(+veterinarioId);
  }
}
