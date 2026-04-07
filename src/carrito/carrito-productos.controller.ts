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
import { AddProductoDto } from './dto/add-producto.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('carrito-productos')
@Controller('carrito-productos')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CarritoProductosController {
  constructor(private readonly carritoService: CarritoService) {}

  // ============================================
  // RUTAS ESTÁTICAS (siempre antes de :param)
  // ============================================

  @Get('mi-carrito')
  @ApiOperation({ summary: 'Obtener productos de mi carrito activo' })
  async getProductosMiCarrito(@Request() req) {
    const usuarioId = req.user?.userId || req.user?.sub || req.user?.id;
    const carrito = await this.carritoService.findCarritoActivo(usuarioId);
    return await this.carritoService.getProductosCarrito(carrito.id);
  }

  @Post('agregar')
  @ApiOperation({ summary: 'Agregar producto al carrito' })
  async addProducto(@Request() req, @Body() addProductoDto: AddProductoDto) {
    const usuarioId = req.user?.userId || req.user?.sub || req.user?.id;
    return await this.carritoService.addProducto(usuarioId, addProductoDto);
  }

  @Delete('vaciar')
  @ApiOperation({ summary: 'Vaciar todos los productos de mi carrito' })
  async vaciarCarrito(@Request() req) {
    const usuarioId = req.user?.userId || req.user?.sub || req.user?.id;
    return await this.carritoService.vaciarCarrito(usuarioId);
  }

  // ============================================
  // RUTAS CON PARÁMETROS (siempre al final)
  // ============================================

  @Patch('actualizar-cantidad/:productoId')
  @ApiOperation({ summary: 'Actualizar cantidad de producto' })
  async updateCantidad(@Request() req, @Param('productoId') productoId: string, @Body() body: { cantidad: number }) {
    const usuarioId = req.user?.userId || req.user?.sub || req.user?.id;
    return await this.carritoService.updateCantidad(usuarioId, +productoId, body.cantidad);
  }

  @Delete('remover/:productoId')
  @ApiOperation({ summary: 'Remover producto del carrito' })
  async removeProducto(@Request() req, @Param('productoId') productoId: string) {
    const usuarioId = req.user?.userId || req.user?.sub || req.user?.id;
    return await this.carritoService.removeProducto(usuarioId, +productoId);
  }
}
