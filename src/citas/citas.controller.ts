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
import { CitasService } from './citas.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { Cita } from './entities/cita.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('citas')
@Controller('citas')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva cita' })
  @ApiResponse({ status: 201, description: 'Cita creada exitosamente', type: Cita })
  @ApiResponse({ status: 404, description: 'Usuario o mascota no encontrada' })
  @ApiResponse({ status: 409, description: 'Conflicto: la mascota no pertenece al usuario o ya existe cita en ese horario' })
  create(@Body() createCitaDto: CreateCitaDto) {
    return this.citasService.create(createCitaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las citas' })
  @ApiResponse({ status: 200, description: 'Lista de citas', type: [Cita] })
  findAll() {
    return this.citasService.findAll();
  }

  @Get('usuario/:usuarioId')
  @ApiOperation({ summary: 'Obtener citas por usuario' })
  @ApiParam({ name: 'usuarioId', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de citas del usuario', type: [Cita] })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findByUsuario(@Param('usuarioId') usuarioId: string) {
    return this.citasService.findByUsuario(+usuarioId);
  }

  @Get('mascota/:mascotaId')
  @ApiOperation({ summary: 'Obtener citas por mascota' })
  @ApiParam({ name: 'mascotaId', description: 'ID de la mascota' })
  @ApiResponse({ status: 200, description: 'Lista de citas de la mascota', type: [Cita] })
  @ApiResponse({ status: 404, description: 'Mascota no encontrada' })
  findByMascota(@Param('mascotaId') mascotaId: string) {
    return this.citasService.findByMascota(+mascotaId);
  }

  @Get('estado/:estado')
  @ApiOperation({ summary: 'Obtener citas por estado' })
  @ApiParam({ name: 'estado', description: 'Estado de la cita (Programada, En curso, Completada, Cancelada)' })
  @ApiResponse({ status: 200, description: 'Lista de citas por estado', type: [Cita] })
  findByEstado(@Param('estado') estado: string) {
    return this.citasService.findByEstado(estado);
  }

  @Get('fecha/:fecha')
  @ApiOperation({ summary: 'Obtener citas por fecha' })
  @ApiParam({ name: 'fecha', description: 'Fecha en formato YYYY-MM-DD' })
  @ApiResponse({ status: 200, description: 'Lista de citas de la fecha', type: [Cita] })
  findByFecha(@Param('fecha') fecha: string) {
    return this.citasService.findByFecha(fecha);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una cita por ID' })
  @ApiParam({ name: 'id', description: 'ID de la cita' })
  @ApiResponse({ status: 200, description: 'Cita encontrada', type: Cita })
  @ApiResponse({ status: 404, description: 'Cita no encontrada' })
  findOne(@Param('id') id: string) {
    return this.citasService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una cita' })
  @ApiParam({ name: 'id', description: 'ID de la cita' })
  @ApiResponse({ status: 200, description: 'Cita actualizada', type: Cita })
  @ApiResponse({ status: 404, description: 'Cita, usuario o mascota no encontrada' })
  @ApiResponse({ status: 409, description: 'Conflicto: la mascota no pertenece al usuario o la fecha no es futura' })
  update(@Param('id') id: string, @Body() updateCitaDto: UpdateCitaDto) {
    return this.citasService.update(+id, updateCitaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una cita' })
  @ApiParam({ name: 'id', description: 'ID de la cita' })
  @ApiResponse({ status: 204, description: 'Cita eliminada' })
  @ApiResponse({ status: 404, description: 'Cita no encontrada' })
  remove(@Param('id') id: string) {
    return this.citasService.remove(+id);
  }
}
