import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportesMaltratoService } from './reportes-maltrato.service';
import { CreateReporteMaltratoDto } from './dto/create-reporte-maltrato.dto';
import { UpdateReporteMaltratoDto } from './dto/update-reporte-maltrato.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('reportes-maltrato')
@Controller('reportes-maltrato')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReportesMaltratoController {
  constructor(private readonly reportesService: ReportesMaltratoService) {}

  @Post()
  @ApiOperation({ summary: 'Enviar una denuncia de maltrato animal (Obligatorio Login)' })
  create(@Request() req, @Body() createDto: CreateReporteMaltratoDto) {
    const usuarioId = req.user?.userId || req.user?.sub || req.user?.id;
    return this.reportesService.create(createDto, usuarioId);
  }

  @Get('mis-reportes')
  @ApiOperation({ summary: 'Obtener el seguimiento de mis denuncias previas enviadas' })
  findMisReportes(@Request() req) {
    const usuarioId = req.user?.userId || req.user?.sub || req.user?.id;
    return this.reportesService.findByUsuario(usuarioId);
  }

  // ---- Funciones para Administradores de la Veterinaria ----

  @Get()
  @ApiOperation({ summary: 'Bandeja de entrada: Leer todos los reportes de maltrato enviados a la clínica (Admin)' })
  findAll() {
    return this.reportesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ver en profundidad un reporte de maltrato por ID' })
  findOne(@Param('id') id: string) {
    return this.reportesService.findOne(+id);
  }

  @Patch(':id/estado')
  @ApiOperation({ summary: 'Modificar el avance/estado del reporte (ej: De Pendiente a Resuelto)' })
  updateEstado(@Param('id') id: string, @Body() updateDto: UpdateReporteMaltratoDto) {
    return this.reportesService.updateEstado(+id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar el reporte de maltrato definitivamente (Admin)' })
  remove(@Param('id') id: string) {
    return this.reportesService.remove(+id);
  }
}
