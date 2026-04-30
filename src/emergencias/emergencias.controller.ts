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
import { EmergenciasService } from './emergencias.service';
import { CreateEmergenciaDto } from './dto/create-emergencia.dto';
import { UpdateEmergenciaDto } from './dto/update-emergencia.dto';
import { Emergencia } from './entities/emergencia.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('emergencias')
@Controller('emergencias')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EmergenciasController {
  constructor(private readonly emergenciasService: EmergenciasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva emergencia' })
  @ApiResponse({ status: 201, description: 'Emergencia creada exitosamente', type: Emergencia })
  @ApiResponse({ status: 404, description: 'Mascota, veterinario o veterinaria no encontrada' })
  create(@Body() createEmergenciaDto: CreateEmergenciaDto) {
    return this.emergenciasService.create(createEmergenciaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las emergencias' })
  @ApiResponse({ status: 200, description: 'Lista de emergencias', type: [Emergencia] })
  findAll() {
    return this.emergenciasService.findAll();
  }

  @Get('mascota/:mascotaId')
  @ApiOperation({ summary: 'Obtener emergencias por mascota' })
  @ApiParam({ name: 'mascotaId', description: 'ID de la mascota' })
  @ApiResponse({ status: 200, description: 'Lista de emergencias de la mascota', type: [Emergencia] })
  @ApiResponse({ status: 404, description: 'Mascota no encontrada' })
  findByMascota(@Param('mascotaId') mascotaId: string) {
    return this.emergenciasService.findByMascota(+mascotaId);
  }

  @Get('veterinario/:veterinarioId')
  @ApiOperation({ summary: 'Obtener emergencias por veterinario' })
  @ApiParam({ name: 'veterinarioId', description: 'ID del veterinario' })
  @ApiResponse({ status: 200, description: 'Lista de emergencias del veterinario', type: [Emergencia] })
  @ApiResponse({ status: 404, description: 'Veterinario no encontrado' })
  findByVeterinario(@Param('veterinarioId') veterinarioId: string) {
    return this.emergenciasService.findByVeterinario(+veterinarioId);
  }

  @Get('veterinaria/:veterinariaId')
  @ApiOperation({ summary: 'Obtener emergencias por veterinaria' })
  @ApiParam({ name: 'veterinariaId', description: 'ID de la veterinaria' })
  @ApiResponse({ status: 200, description: 'Lista de emergencias de la veterinaria', type: [Emergencia] })
  @ApiResponse({ status: 404, description: 'Veterinaria no encontrada' })
  findByVeterinaria(@Param('veterinariaId') veterinariaId: string) {
    return this.emergenciasService.findByVeterinaria(+veterinariaId);
  }

  @Get('tipo/:tipo')
  @ApiOperation({ summary: 'Obtener emergencias por tipo' })
  @ApiParam({ name: 'tipo', description: 'Tipo de emergencia' })
  @ApiResponse({ status: 200, description: 'Lista de emergencias por tipo', type: [Emergencia] })
  findByTipo(@Param('tipo') tipo: string) {
    return this.emergenciasService.findByTipo(tipo);
  }

  @Get('fecha/:fecha')
  @ApiOperation({ summary: 'Obtener emergencias por fecha' })
  @ApiParam({ name: 'fecha', description: 'Fecha (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Lista de emergencias por fecha', type: [Emergencia] })
  findByFecha(@Param('fecha') fecha: string) {
    return this.emergenciasService.findByFecha(fecha);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una emergencia por ID' })
  @ApiParam({ name: 'id', description: 'ID de la emergencia' })
  @ApiResponse({ status: 200, description: 'Emergencia encontrada', type: Emergencia })
  @ApiResponse({ status: 404, description: 'Emergencia no encontrada' })
  findOne(@Param('id') id: string) {
    return this.emergenciasService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una emergencia' })
  @ApiParam({ name: 'id', description: 'ID de la emergencia' })
  @ApiResponse({ status: 200, description: 'Emergencia actualizada', type: Emergencia })
  @ApiResponse({ status: 404, description: 'Emergencia, mascota, veterinario o veterinaria no encontrada' })
  update(@Param('id') id: string, @Body() updateEmergenciaDto: UpdateEmergenciaDto) {
    return this.emergenciasService.update(+id, updateEmergenciaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una emergencia' })
  @ApiParam({ name: 'id', description: 'ID de la emergencia' })
  @ApiResponse({ status: 204, description: 'Emergencia eliminada' })
  @ApiResponse({ status: 404, description: 'Emergencia no encontrada' })
  remove(@Param('id') id: string) {
    return this.emergenciasService.remove(+id);
  }
}
