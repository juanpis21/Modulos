import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { HistorialCitasService } from './historial-citas.service';
import { CreateHistorialCitaDto } from './dto/create-historial-cita.dto';
import { UpdateHistorialCitaDto } from './dto/update-historial-cita.dto';
import { HistorialCita } from './entities/historial-cita.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('historial-citas')
@Controller('historial-citas')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class HistorialCitasController {
  constructor(private readonly historialCitasService: HistorialCitasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo registro en el historial de citas' })
  @ApiResponse({ status: 201, description: 'Registro de historial creado exitosamente', type: HistorialCita })
  @ApiResponse({ status: 404, description: 'Cita o usuario no encontrado' })
  create(@Body() createHistorialCitaDto: CreateHistorialCitaDto) {
    return this.historialCitasService.create(createHistorialCitaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los registros del historial de citas' })
  @ApiResponse({ status: 200, description: 'Lista de registros del historial', type: [HistorialCita] })
  findAll() {
    return this.historialCitasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un registro del historial por ID' })
  @ApiParam({ name: 'id', description: 'ID del registro del historial' })
  @ApiResponse({ status: 200, description: 'Registro del historial encontrado', type: HistorialCita })
  @ApiResponse({ status: 404, description: 'Registro del historial no encontrado' })
  findOne(@Param('id') id: string) {
    return this.historialCitasService.findOne(+id);
  }

  @Get('cita/:citaId')
  @ApiOperation({ summary: 'Obtener historial por cita' })
  @ApiParam({ name: 'citaId', description: 'ID de la cita' })
  @ApiResponse({ status: 200, description: 'Historial de la cita', type: [HistorialCita] })
  @ApiResponse({ status: 404, description: 'Cita no encontrada' })
  findByCita(@Param('citaId') citaId: string) {
    return this.historialCitasService.findByCita(+citaId);
  }

  @Get('usuario/:usuarioId')
  @ApiOperation({ summary: 'Obtener historial por usuario' })
  @ApiParam({ name: 'usuarioId', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Historial del usuario', type: [HistorialCita] })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findByUsuario(@Param('usuarioId') usuarioId: string) {
    return this.historialCitasService.findByUsuario(+usuarioId);
  }

  @Get('tipo/:tipoCambio')
  @ApiOperation({ summary: 'Obtener historial por tipo de cambio' })
  @ApiParam({ name: 'tipoCambio', description: 'Tipo de cambio' })
  @ApiResponse({ status: 200, description: 'Historial por tipo de cambio', type: [HistorialCita] })
  findByTipo(@Param('tipoCambio') tipoCambio: string) {
    return this.historialCitasService.findByTipoCambio(tipoCambio);
  }

  @Get('fecha')
  @ApiOperation({ summary: 'Obtener historial por rango de fechas' })
  @ApiQuery({ name: 'fechaInicio', description: 'Fecha de inicio (YYYY-MM-DD)' })
  @ApiQuery({ name: 'fechaFin', description: 'Fecha de fin (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Historial por rango de fechas', type: [HistorialCita] })
  findByFechaRange(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string
  ) {
    return this.historialCitasService.findByFechaRange(fechaInicio, fechaFin);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un registro del historial' })
  @ApiParam({ name: 'id', description: 'ID del registro del historial' })
  @ApiResponse({ status: 200, description: 'Registro del historial actualizado', type: HistorialCita })
  @ApiResponse({ status: 404, description: 'Registro del historial no encontrado' })
  update(@Param('id') id: string, @Body() updateHistorialCitaDto: UpdateHistorialCitaDto) {
    return this.historialCitasService.update(+id, updateHistorialCitaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un registro del historial' })
  @ApiParam({ name: 'id', description: 'ID del registro del historial' })
  @ApiResponse({ status: 204, description: 'Registro del historial eliminado' })
  @ApiResponse({ status: 404, description: 'Registro del historial no encontrado' })
  remove(@Param('id') id: string) {
    return this.historialCitasService.remove(+id);
  }

  // Endpoints para registrar cambios automáticamente
  @Post('registrar-creacion/:citaId')
  @ApiOperation({ summary: 'Registrar creación de cita' })
  @ApiParam({ name: 'citaId', description: 'ID de la cita' })
  @ApiResponse({ status: 201, description: 'Creación registrada', type: HistorialCita })
  registrarCreacion(@Param('citaId') citaId: string, @Body() body: { usuarioId: number; descripcion: string }) {
    return this.historialCitasService.registrarCreacionCita(+citaId, body.usuarioId, body.descripcion);
  }

  @Post('registrar-actualizacion/:citaId')
  @ApiOperation({ summary: 'Registrar actualización de cita' })
  @ApiParam({ name: 'citaId', description: 'ID de la cita' })
  @ApiResponse({ status: 201, description: 'Actualización registrada', type: HistorialCita })
  registrarActualizacion(@Param('citaId') citaId: string, @Body() body: { usuarioId: number; descripcion: string; valoresAnteriores: any; valoresNuevos: any }) {
    return this.historialCitasService.registrarActualizacionCita(+citaId, body.usuarioId, body.descripcion, body.valoresAnteriores, body.valoresNuevos);
  }

  @Post('registrar-eliminacion/:citaId')
  @ApiOperation({ summary: 'Registrar eliminación de cita' })
  @ApiParam({ name: 'citaId', description: 'ID de la cita' })
  @ApiResponse({ status: 201, description: 'Eliminación registrada', type: HistorialCita })
  registrarEliminacion(@Param('citaId') citaId: string, @Body() body: { usuarioId: number; descripcion: string }) {
    return this.historialCitasService.registrarCancelacionCita(+citaId, body.usuarioId, body.descripcion);
  }
}
