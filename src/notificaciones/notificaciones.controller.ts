import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificacionesService } from './notificaciones.service';
import { CreateNotificacionDto } from './dto/create-notificacion.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('notificaciones')
@Controller('notificaciones')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}

  @Get('mis-notificaciones')
  @ApiOperation({ summary: 'Obtener todas mis notificaciones' })
  async getMisNotificaciones(@Request() req) {
    const usuarioId = req.user?.userId || req.user?.sub || req.user?.id;
    return this.notificacionesService.findByUsuario(usuarioId);
  }

  @Get('no-leidas')
  @ApiOperation({ summary: 'Obtener solo mis notificaciones no leidas' })
  async getNoLeidas(@Request() req) {
    const usuarioId = req.user?.userId || req.user?.sub || req.user?.id;
    return this.notificacionesService.findNoLeidasByUsuario(usuarioId);
  }

  @Patch('marcar-todas-leidas')
  @ApiOperation({ summary: 'Marcar todo mi inbox como leído' })
  async marcarTodasLeidas(@Request() req) {
    const usuarioId = req.user?.userId || req.user?.sub || req.user?.id;
    await this.notificacionesService.marcarTodasComoLeidas(usuarioId);
    return { statusCode: 200, message: 'Todas las notificaciones han sido marcadas como leídas' };
  }

  @Patch(':id/leer')
  @ApiOperation({ summary: 'Marcar una notificación específica como leída' })
  async marcarComoLeida(@Request() req, @Param('id') id: string) {
    const usuarioId = req.user?.userId || req.user?.sub || req.user?.id;
    return this.notificacionesService.marcarComoLeida(+id, usuarioId);
  }

  // ---- Endpoints para Admin o Integración Externa ----

  @Post()
  @ApiOperation({ summary: 'Disparar una nueva notificación manualmente (Admin)' })
  async create(@Body() createNotificacionDto: CreateNotificacionDto) {
    return this.notificacionesService.enviar(createNotificacionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener el registro global de notificaciones del sistema (Admin)' })
  async findAll() {
    return this.notificacionesService.findAll();
  }
}
