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

  @Post('checkout-test')
  @ApiOperation({ summary: 'Endpoint de prueba: Simula un checkout exitoso con datos falsos' })
  async checkoutTest() {
    return {
      "id": 999,
      "subtotal": "250.50",
      "total": "250.50",
      "usuarioId": 1,
      "fecha": new Date().toISOString(),
      "updatedAt": new Date().toISOString(),
      "detalles": [
        {
          "id": 1001,
          "cantidad": 2,
          "precioUnitario": "100.00",
          "ventaId": 999,
          "productoId": 5,
          "producto": {
            "id": 5,
            "nombre": "Alimento Premium Perro (Mock)",
            "precioVenta": "100.00",
            "stockActual": 48
          }
        },
        {
          "id": 1002,
          "cantidad": 1,
          "precioUnitario": "50.50",
          "ventaId": 999,
          "productoId": 12,
          "producto": {
            "id": 12,
            "nombre": "Collar Antipulgas (Mock)",
            "precioVenta": "50.50",
            "stockActual": 14
          }
        }
      ]
    };
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
