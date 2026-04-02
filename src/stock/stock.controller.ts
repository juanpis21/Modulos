import { 
  Controller, 
  Get, 
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { StockService } from './stock.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('stock')
@Controller('stock')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get('bajo-stock')
  @ApiOperation({ summary: 'Obtener productos con stock bajo' })
  @ApiResponse({ status: 200, description: 'Productos con stock bajo' })
  getProductosBajoStock() {
    return this.stockService.getProductosBajoStock();
  }

  @Get('por-vencer')
  @ApiOperation({ summary: 'Obtener productos próximos a vencer' })
  @ApiQuery({ name: 'dias', description: 'Días para vencimiento', required: false })
  @ApiResponse({ status: 200, description: 'Productos próximos a vencer' })
  getProductosPorVencer(@Query('dias') dias?: number) {
    return this.stockService.getProductosPorVencer(dias ? +dias : 30);
  }

  @Get('reporte/categorias')
  @ApiOperation({ summary: 'Obtener reporte de stock por categoría' })
  @ApiResponse({ status: 200, description: 'Reporte de stock por categoría' })
  getReporteStockPorCategoria() {
    return this.stockService.getReporteStockPorCategoria();
  }

  @Get('reporte/veterinarias')
  @ApiOperation({ summary: 'Obtener reporte de stock por veterinaria' })
  @ApiResponse({ status: 200, description: 'Reporte de stock por veterinaria' })
  getReporteStockPorVeterinaria() {
    return this.stockService.getReporteStockPorVeterinaria();
  }

  @Get('reporte/valor-total')
  @ApiOperation({ summary: 'Obtener valor total del inventario' })
  @ApiResponse({ status: 200, description: 'Valor total del inventario' })
  getReporteValorTotalInventario() {
    return this.stockService.getReporteValorTotalInventario();
  }

  @Get('alertas')
  @ApiOperation({ summary: 'Obtener todas las alertas de stock' })
  @ApiResponse({ status: 200, description: 'Alertas de stock' })
  getAlertasStock() {
    return this.stockService.getAlertasStock();
  }
}
