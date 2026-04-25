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
import { AdopcionesService } from './adopciones.service';
import { CreateAdopcionDto } from './dto/create-adopcion.dto';
import { UpdateAdopcionDto } from './dto/update-adopcion.dto';
import { Adopcion } from './entities/adopcion.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('adopciones')
@Controller('adopciones')

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()

export class AdopcionesController {
  constructor(private readonly adopcionesService: AdopcionesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva solicitud de adopción' })
  @ApiResponse({ status: 201, description: 'Solicitud de adopción creada exitosamente', type: Adopcion })
  @ApiResponse({ status: 404, description: 'Mascota, adoptante o veterinaria no encontrado' })
  @ApiResponse({ status: 409, description: 'La mascota ya tiene una adopción activa' })
  create(@Body() createAdopcionDto: CreateAdopcionDto) {
    return this.adopcionesService.create(createAdopcionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las solicitudes de adopción' })
  @ApiResponse({ status: 200, description: 'Lista de solicitudes de adopción', type: [Adopcion] })
  findAll() {
    return this.adopcionesService.findAll();
  }


  @Get('mascota/:mascotaId')
  @ApiOperation({ summary: 'Obtener solicitudes por mascota' })
  @ApiParam({ name: 'mascotaId', description: 'ID de la mascota' })
  @ApiResponse({ status: 200, description: 'Solicitudes de adopción de la mascota', type: [Adopcion] })
  @ApiResponse({ status: 404, description: 'Mascota no encontrada' })
  findByMascota(@Param('mascotaId') mascotaId: string) {
    return this.adopcionesService.findByMascota(+mascotaId);
  }

  @Get('adoptante/:adoptanteId')
  @ApiOperation({ summary: 'Obtener solicitudes por adoptante' })
  @ApiParam({ name: 'adoptanteId', description: 'ID del adoptante' })
  @ApiResponse({ status: 200, description: 'Solicitudes de adopción del adoptante', type: [Adopcion] })
  @ApiResponse({ status: 404, description: 'Adoptante no encontrado' })
  findByAdoptante(@Param('adoptanteId') adoptanteId: string) {
    return this.adopcionesService.findByAdoptante(+adoptanteId);
  }

  @Get('veterinaria/:veterinariaId')
  @ApiOperation({ summary: 'Obtener solicitudes por veterinaria' })
  @ApiParam({ name: 'veterinariaId', description: 'ID de la veterinaria' })
  @ApiResponse({ status: 200, description: 'Solicitudes de adopción de la veterinaria', type: [Adopcion] })
  @ApiResponse({ status: 404, description: 'Veterinaria no encontrada' })
  findByVeterinaria(@Param('veterinariaId') veterinariaId: string) {
    return this.adopcionesService.findByVeterinaria(+veterinariaId);
  }

  @Get('estado/:estado')
  @ApiOperation({ summary: 'Obtener solicitudes por estado' })
  @ApiParam({ name: 'estado', description: 'Estado de la adopción' })
  @ApiResponse({ status: 200, description: 'Solicitudes por estado', type: [Adopcion] })
  findByEstado(@Param('estado') estado: string) {
    return this.adopcionesService.findByEstado(estado);
  }

  @Get('fecha')
  @ApiOperation({ summary: 'Obtener solicitudes por rango de fechas' })
  @ApiQuery({ name: 'fechaInicio', description: 'Fecha de inicio (YYYY-MM-DD)' })
  @ApiQuery({ name: 'fechaFin', description: 'Fecha de fin (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Solicitudes por rango de fechas', type: [Adopcion] })
  findByFechaRange(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string
  ) {
    return this.adopcionesService.findByFechaRange(fechaInicio, fechaFin);
  }


  // Endpoints auxiliares para gestión de estados
  @Post(':id/aprobar')
  @ApiOperation({ summary: 'Aprobar una solicitud de adopción' })
  @ApiParam({ name: 'id', description: 'ID de la solicitud de adopción' })
  @ApiResponse({ status: 200, description: 'Solicitud aprobada', type: Adopcion })
  @ApiResponse({ status: 404, description: 'Solicitud de adopción no encontrada' })
  aprobarAdopcion(
    @Param('id') id: string,
    @Body() body: { usuarioId: number; observaciones?: string }
  ) {
    return this.adopcionesService.aprobarAdopcion(+id, body.usuarioId, body.observaciones);
  }

  @Post(':id/completar')
  @ApiOperation({ summary: 'Completar una adopción' })
  @ApiParam({ name: 'id', description: 'ID de la solicitud de adopción' })
  @ApiResponse({ status: 200, description: 'Adopción completada', type: Adopcion })
  @ApiResponse({ status: 404, description: 'Solicitud de adopción no encontrada' })
  completarAdopcion(
    @Param('id') id: string,
    @Body() body: { usuarioId: number; observaciones?: string }
  ) {
    return this.adopcionesService.completarAdopcion(+id, body.usuarioId, body.observaciones);
  }

  @Post(':id/rechazar')
  @ApiOperation({ summary: 'Rechazar una solicitud de adopción' })
  @ApiParam({ name: 'id', description: 'ID de la solicitud de adopción' })
  @ApiResponse({ status: 200, description: 'Solicitud rechazada', type: Adopcion })
  @ApiResponse({ status: 404, description: 'Solicitud de adopción no encontrada' })
  rechazarAdopcion(
    @Param('id') id: string,
    @Body() body: { usuarioId: number; motivo: string }
  ) {
    return this.adopcionesService.rechazarAdopcion(+id, body.usuarioId, body.motivo);
  }

  @Post(':id/cancelar')
  @ApiOperation({ summary: 'Cancelar una solicitud de adopción' })
  @ApiParam({ name: 'id', description: 'ID de la solicitud de adopción' })
  @ApiResponse({ status: 200, description: 'Solicitud cancelada', type: Adopcion })
  @ApiResponse({ status: 404, description: 'Solicitud de adopción no encontrada' })
  cancelarAdopcion(
    @Param('id') id: string,
    @Body() body: { usuarioId: number; motivo: string }
  ) {
    return this.adopcionesService.cancelarAdopcion(+id, body.usuarioId, body.motivo);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una solicitud de adopción por ID' })
  @ApiParam({ name: 'id', description: 'ID de la solicitud de adopción' })
  @ApiResponse({ status: 200, description: 'Solicitud de adopción encontrada', type: Adopcion })
  @ApiResponse({ status: 404, description: 'Solicitud de adopción no encontrada' })
  findOne(@Param('id') id: string) {
    return this.adopcionesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una solicitud de adopción' })
  @ApiParam({ name: 'id', description: 'ID de la solicitud de adopción' })
  @ApiResponse({ status: 200, description: 'Solicitud de adopción actualizada', type: Adopcion })
  @ApiResponse({ status: 404, description: 'Solicitud de adopción no encontrada' })
  update(@Param('id') id: string, @Body() updateAdopcionDto: UpdateAdopcionDto) {
    return this.adopcionesService.update(+id, updateAdopcionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una solicitud de adopción' })
  @ApiParam({ name: 'id', description: 'ID de la solicitud de adopción' })
  @ApiResponse({ status: 204, description: 'Solicitud de adopción eliminada' })
  @ApiResponse({ status: 404, description: 'Solicitud de adopción no encontrada' })
  remove(@Param('id') id: string) {
    return this.adopcionesService.remove(+id);
  }
}
