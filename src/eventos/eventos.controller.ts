import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EventosService } from './eventos.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('eventos')
@Controller('eventos')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EventosController {
  constructor(private readonly eventosService: EventosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo evento (Solo Admins/Clínica)' })
  create(@Body() createEventoDto: CreateEventoDto) {
    return this.eventosService.create(createEventoDto);
  }

  @Public() // Todos pueden ver
  @Get()
  @ApiOperation({ summary: 'Listar TODOS los eventos en la plataforma' })
  findAll() {
    return this.eventosService.findAll();
  }

  @Public() // Todos pueden ver
  @Get('vigentes')
  @ApiOperation({ summary: 'Listar solo eventos activos o futuros' })
  findActive() {
    return this.eventosService.findActive();
  }

  @Public() // Todos pueden ver
  @Get('veterinaria/:id')
  @ApiOperation({ summary: 'Historial de eventos de una veterinaria' })
  findByVeterinaria(@Param('id') id: string) {
    return this.eventosService.findByVeterinaria(+id);
  }

  @Public() // Todos pueden ver
  @Get(':id')
  @ApiOperation({ summary: 'Buscar detalles de 1 evento por su ID' })
  findOne(@Param('id') id: string) {
    return this.eventosService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar datos de un evento (Solo Admins)' })
  update(@Param('id') id: string, @Body() updateEventoDto: UpdateEventoDto) {
    return this.eventosService.update(+id, updateEventoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar o cancelar evento definitivamente' })
  remove(@Param('id') id: string) {
    return this.eventosService.remove(+id);
  }
}
