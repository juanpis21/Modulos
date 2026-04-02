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
import { MovimientosService } from './movimientos.service';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { UpdateMovimientoDto } from './dto/update-movimiento.dto';
import { MovimientoInventario } from './entities/movimiento-inventario.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('movimientos')
@Controller('movimientos')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MovimientosController {
  constructor(private readonly movimientosService: MovimientosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo movimiento de inventario' })
  @ApiResponse({ status: 201, description: 'Movimiento creado exitosamente', type: MovimientoInventario })
  @ApiResponse({ status: 409, description: 'Stock insuficiente para esta salida' })
  create(@Body() createMovimientoDto: CreateMovimientoDto) {
    return this.movimientosService.create(createMovimientoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los movimientos de inventario' })
  @ApiResponse({ status: 200, description: 'Lista de movimientos', type: [MovimientoInventario] })
  findAll() {
    return this.movimientosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un movimiento por ID' })
  @ApiParam({ name: 'id', description: 'ID del movimiento' })
  @ApiResponse({ status: 200, description: 'Movimiento encontrado', type: MovimientoInventario })
  @ApiResponse({ status: 404, description: 'Movimiento no encontrado' })
  findOne(@Param('id') id: string) {
    return this.movimientosService.findOne(+id);
  }

  @Get('producto/:productoId')
  @ApiOperation({ summary: 'Obtener movimientos por producto' })
  @ApiParam({ name: 'productoId', description: 'ID del producto' })
  @ApiResponse({ status: 200, description: 'Movimientos del producto', type: [MovimientoInventario] })
  findByProducto(@Param('productoId') productoId: string) {
    return this.movimientosService.findByProducto(+productoId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un movimiento' })
  @ApiParam({ name: 'id', description: 'ID del movimiento' })
  @ApiResponse({ status: 200, description: 'Movimiento actualizado', type: MovimientoInventario })
  @ApiResponse({ status: 404, description: 'Movimiento no encontrado' })
  update(@Param('id') id: string, @Body() updateMovimientoDto: UpdateMovimientoDto) {
    return this.movimientosService.update(+id, updateMovimientoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un movimiento' })
  @ApiParam({ name: 'id', description: 'ID del movimiento' })
  @ApiResponse({ status: 204, description: 'Movimiento eliminado' })
  @ApiResponse({ status: 404, description: 'Movimiento no encontrado' })
  remove(@Param('id') id: string) {
    return this.movimientosService.remove(+id);
  }
}
