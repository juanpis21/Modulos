import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { HistoriasClinicasService } from './historias-clinicas.service';
import { CreateHistoriaClinicaDto } from './dto/create-historia-clinica.dto';
import { UpdateHistoriaClinicaDto } from './dto/update-historia-clinica.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('historias-clinicas')
@Controller('historias-clinicas')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class HistoriasClinicasController {
  constructor(private readonly historiasClinicasService: HistoriasClinicasService) {}

  @Post()
  @ApiOperation({ summary: 'Aperturar el expediente vital de un paciente por primera vez' })
  create(@Body() createDto: CreateHistoriaClinicaDto) {
    return this.historiasClinicasService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Ver el archivero maestro de todas las historias clínicas del servidor' })
  findAll() {
    return this.historiasClinicasService.findAll();
  }

  @Get('mascota/:mascotaId')
  @ApiOperation({ summary: 'Consultar directamente el expediente de un paciente usando su ID de Mascota' })
  findByMascota(@Param('mascotaId') mascotaId: string) {
    return this.historiasClinicasService.findByMascota(+mascotaId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ver detalles del fólder buscando físicamente por el ID del expediente' })
  findOne(@Param('id') id: string) {
    return this.historiasClinicasService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Añadir nueva observación clínica o reemplazar el texto del expediente' })
  update(@Param('id') id: string, @Body() updateDto: UpdateHistoriaClinicaDto) {
    return this.historiasClinicasService.update(+id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Destruir legal y definitivamente un expediente' })
  remove(@Param('id') id: string) {
    return this.historiasClinicasService.remove(+id);
  }
}
