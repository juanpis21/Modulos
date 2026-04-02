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
import { VeterinariasService } from './veterinarias.service';
import { CreateVeterinariaDto } from './dto/create-veterinaria.dto';
import { UpdateVeterinariaDto } from './dto/update-veterinaria.dto';
import { Veterinaria } from './entities/veterinaria.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('veterinarias')
@Controller('veterinarias')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VeterinariasController {
  constructor(private readonly veterinariasService: VeterinariasService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Crear una nueva veterinaria' })
  @ApiResponse({ status: 201, description: 'Veterinaria creada exitosamente', type: Veterinaria })
  @ApiResponse({ status: 409, description: 'La veterinaria con este correo o RUT ya existe' })
  create(@Body() createVeterinariaDto: CreateVeterinariaDto) {
    return this.veterinariasService.create(createVeterinariaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las veterinarias' })
  @ApiResponse({ status: 200, description: 'Lista de veterinarias', type: [Veterinaria] })
  findAll() {
    return this.veterinariasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una veterinaria por ID' })
  @ApiParam({ name: 'id', description: 'ID de la veterinaria' })
  @ApiResponse({ status: 200, description: 'Veterinaria encontrada', type: Veterinaria })
  @ApiResponse({ status: 404, description: 'Veterinaria no encontrada' })
  findOne(@Param('id') id: string) {
    return this.veterinariasService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una veterinaria' })
  @ApiParam({ name: 'id', description: 'ID de la veterinaria' })
  @ApiResponse({ status: 200, description: 'Veterinaria actualizada', type: Veterinaria })
  @ApiResponse({ status: 404, description: 'Veterinaria no encontrada' })
  @ApiResponse({ status: 409, description: 'La veterinaria con este correo o RUT ya existe' })
  update(@Param('id') id: string, @Body() updateVeterinariaDto: UpdateVeterinariaDto) {
    return this.veterinariasService.update(+id, updateVeterinariaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una veterinaria' })
  @ApiParam({ name: 'id', description: 'ID de la veterinaria' })
  @ApiResponse({ status: 204, description: 'Veterinaria eliminada' })
  @ApiResponse({ status: 404, description: 'Veterinaria no encontrada' })
  remove(@Param('id') id: string) {
    return this.veterinariasService.remove(+id);
  }
}
