import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  UseGuards,
  Request
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CarritoService } from './carrito.service';
import { CreateCarritoDto } from './dto/create-carrito.dto';
import { UpdateCarritoDto } from './dto/update-carrito.dto';
import { Carrito } from './entities/carrito.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('carritos')
@Controller('carritos')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CarritosController {
  constructor(private readonly carritoService: CarritoService) {}

  // ============================================
  // RUTAS ESTÁTICAS (siempre antes de :id)
  // ============================================

  @Get('mi-carrito')
  @ApiOperation({ summary: 'Obtener mi carrito activo' })
  async getMiCarrito(@Request() req) {
    const usuarioId = req.user?.userId || req.user?.sub || req.user?.id;
    return await this.carritoService.findCarritoActivo(usuarioId);
  }

  @Get('mis-carritos')
  @ApiOperation({ summary: 'Obtener todos mis carritos' })
  async getMisCarritos(@Request() req) {
    const usuarioId = req.user?.userId || req.user?.sub || req.user?.id;
    return await this.carritoService.findByUsuario(usuarioId);
  }

  @Get('resumen')
  @ApiOperation({ summary: 'Obtener resumen de mi carrito' })
  async getResumen(@Request() req) {
    const usuarioId = req.user?.userId || req.user?.sub || req.user?.id;
    return await this.carritoService.getResumenCarrito(usuarioId);
  }

  // ============================================
  // RUTAS BASE (sin parámetros)
  // ============================================

  @Get()
  @ApiOperation({ summary: 'Obtener todos los carritos (Admin)' })
  async findAll() {
    return await this.carritoService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Crear nuevo carrito' })
  async create(@Request() req, @Body() createCarritoDto: CreateCarritoDto) {
    const usuarioId = req.user?.userId || req.user?.sub || req.user?.id;
    return await this.carritoService.create(usuarioId, createCarritoDto);
  }

  // ============================================
  // RUTAS CON PARÁMETROS (siempre al final)
  // ============================================

  @Get(':id')
  @ApiOperation({ summary: 'Obtener carrito por ID' })
  async findOne(@Param('id') id: string) {
    return await this.carritoService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar carrito' })
  async update(@Param('id') id: string, @Body() updateCarritoDto: UpdateCarritoDto) {
    return await this.carritoService.update(+id, updateCarritoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar carrito' })
  async remove(@Param('id') id: string) {
    return await this.carritoService.remove(+id);
  }
}
