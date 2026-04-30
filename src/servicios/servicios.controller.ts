import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ServiciosService } from './servicios.service';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { Servicio } from './entities/servicio.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('servicios')
@Controller('servicios')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ServiciosController {
  constructor(private readonly serviciosService: ServiciosService) {}

  // Endpoints para Servicios
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo servicio' })
  @ApiResponse({ status: 201, description: 'Servicio creado exitosamente', type: Servicio })
  create(@Body() createServicioDto: CreateServicioDto) {
    return this.serviciosService.create(createServicioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los servicios activos' })
  @ApiResponse({ status: 200, description: 'Lista de servicios', type: [Servicio] })
  findAll() {
    return this.serviciosService.findAll();
  }


  @Get('veterinaria/:veterinariaId')
  @ApiOperation({ summary: 'Obtener servicios por veterinaria' })
  @ApiParam({ name: 'veterinariaId', description: 'ID de la veterinaria' })
  @ApiResponse({ status: 200, description: 'Servicios de la veterinaria', type: [Servicio] })
  findByVeterinaria(@Param('veterinariaId') veterinariaId: string) {
    return this.serviciosService.findByVeterinaria(+veterinariaId);
  }

  @Get('tipo/:tipoServicio')
  @ApiOperation({ summary: 'Obtener servicios por tipo' })
  @ApiParam({ name: 'tipoServicio', description: 'Tipo de servicio' })
  @ApiResponse({ status: 200, description: 'Servicios del tipo', type: [Servicio] })
  findByTipo(@Param('tipoServicio') tipoServicio: string) {
    return this.serviciosService.findByTipo(tipoServicio);
  }

  @Get('search/:query')
  @ApiOperation({ summary: 'Buscar servicios' })
  @ApiParam({ name: 'query', description: 'Término de búsqueda' })
  @ApiResponse({ status: 200, description: 'Resultados de búsqueda', type: [Servicio] })
  searchServicios(@Param('query') query: string) {
    return this.serviciosService.searchServicios(query);
  }

  // Endpoints de Reportes
  @Get('reportes/por-veterinaria')
  @ApiOperation({ summary: 'Obtener reporte de servicios por veterinaria' })
  @ApiResponse({ status: 200, description: 'Reporte por veterinaria' })
  getReporteServiciosPorVeterinaria() {
    return this.serviciosService.getReporteServiciosPorVeterinaria();
  }

  @Get('reportes/por-tipo')
  @ApiOperation({ summary: 'Obtener reporte de servicios por tipo' })
  @ApiResponse({ status: 200, description: 'Reporte por tipo' })
  getServiciosPorTipo() {
    return this.serviciosService.getServiciosPorTipo();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un servicio por ID' })
  @ApiParam({ name: 'id', description: 'ID del servicio' })
  @ApiResponse({ status: 200, description: 'Servicio encontrado', type: Servicio })
  @ApiResponse({ status: 404, description: 'Servicio no encontrado' })
  findOne(@Param('id') id: string) {
    return this.serviciosService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un servicio' })
  @ApiParam({ name: 'id', description: 'ID del servicio' })
  @ApiResponse({ status: 200, description: 'Servicio actualizado', type: Servicio })
  @ApiResponse({ status: 404, description: 'Servicio no encontrado' })
  update(@Param('id') id: string, @Body() updateServicioDto: UpdateServicioDto) {
    return this.serviciosService.update(+id, updateServicioDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar un servicio' })
  @ApiParam({ name: 'id', description: 'ID del servicio' })
  @ApiResponse({ status: 200, description: 'Servicio desactivado' })
  @ApiResponse({ status: 404, description: 'Servicio no encontrado' })
  remove(@Param('id') id: string) {
    return this.serviciosService.remove(+id);
  }
}
