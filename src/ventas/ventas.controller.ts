import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VentasService } from './ventas.service';
import { CheckoutDto } from './dto/checkout.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('ventas')
@Controller('ventas')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post('checkout')
  @ApiOperation({ summary: 'Convertir carrito activo en Venta' })
  async checkout(@Request() req, @Body() checkoutDto: CheckoutDto) {
    const usuarioId = req.user?.userId || req.user?.sub || req.user?.id;
    return await this.ventasService.checkout(usuarioId, checkoutDto);
  }


  @Get('mis-compras')
  @ApiOperation({ summary: 'Obtener historial de compras del usuario' })
  async getMisCompras(@Request() req) {
    const usuarioId = req.user?.userId || req.user?.sub || req.user?.id;
    return await this.ventasService.findByUsuario(usuarioId);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las ventas del sistema (Admin)' })
  async findAll() {
    return this.ventasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de una venta por ID' })
  async findOne(@Param('id') id: string) {
    return this.ventasService.findOne(+id);
  }
}
