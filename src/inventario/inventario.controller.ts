import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { InventarioService } from './inventario.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { UpdateMovimientoDto } from './dto/update-movimiento.dto';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { Producto } from './entities/producto.entity';
import { Categoria } from './entities/categoria.entity';
import { MovimientoInventario } from './entities/movimiento-inventario.entity';
import { Proveedor } from './entities/proveedor.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('inventario')
@Controller('inventario')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) {}

  // ============ PRODUCTOS ============
  @Post('productos')
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente', type: Producto })
  @ApiResponse({ status: 409, description: 'El producto con este código de barras ya existe' })
  createProducto(@Body() createProductoDto: CreateProductoDto) {
    return this.inventarioService.createProducto(createProductoDto);
  }

  @Get('productos')
  @ApiOperation({ summary: 'Obtener todos los productos' })
  @ApiResponse({ status: 200, description: 'Lista de productos', type: [Producto] })
  findAllProductos() {
    return this.inventarioService.findAllProductos();
  }

  @Get('productos/:id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  @ApiResponse({ status: 200, description: 'Producto encontrado', type: Producto })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  findProductoById(@Param('id') id: string) {
    return this.inventarioService.findProductoById(+id);
  }

  @Patch('productos/:id')
  @ApiOperation({ summary: 'Actualizar un producto' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  @ApiResponse({ status: 200, description: 'Producto actualizado', type: Producto })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  updateProducto(@Param('id') id: string, @Body() updateProductoDto: UpdateProductoDto) {
    return this.inventarioService.updateProducto(+id, updateProductoDto);
  }

  @Delete('productos/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  @ApiResponse({ status: 204, description: 'Producto eliminado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  removeProducto(@Param('id') id: string) {
    return this.inventarioService.removeProducto(+id);
  }

  // ============ CATEGORÍAS ============
  @Post('categorias')
  @ApiOperation({ summary: 'Crear una nueva categoría' })
  @ApiResponse({ status: 201, description: 'Categoría creada exitosamente', type: Categoria })
  @ApiResponse({ status: 409, description: 'La categoría con este código ya existe' })
  createCategoria(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.inventarioService.createCategoria(createCategoriaDto);
  }

  @Get('categorias')
  @ApiOperation({ summary: 'Obtener todas las categorías' })
  @ApiResponse({ status: 200, description: 'Lista de categorías', type: [Categoria] })
  findAllCategorias() {
    return this.inventarioService.findAllCategorias();
  }

  @Get('categorias/:id')
  @ApiOperation({ summary: 'Obtener una categoría por ID' })
  @ApiParam({ name: 'id', description: 'ID de la categoría' })
  @ApiResponse({ status: 200, description: 'Categoría encontrada', type: Categoria })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  findCategoriaById(@Param('id') id: string) {
    return this.inventarioService.findCategoriaById(+id);
  }

  @Patch('categorias/:id')
  @ApiOperation({ summary: 'Actualizar una categoría' })
  @ApiParam({ name: 'id', description: 'ID de la categoría' })
  @ApiResponse({ status: 200, description: 'Categoría actualizada', type: Categoria })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  updateCategoria(@Param('id') id: string, @Body() updateCategoriaDto: UpdateCategoriaDto) {
    return this.inventarioService.updateCategoria(+id, updateCategoriaDto);
  }

  @Delete('categorias/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una categoría' })
  @ApiParam({ name: 'id', description: 'ID de la categoría' })
  @ApiResponse({ status: 204, description: 'Categoría eliminada' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  removeCategoria(@Param('id') id: string) {
    return this.inventarioService.removeCategoria(+id);
  }

  // ============ MOVIMIENTOS ============
  @Post('movimientos')
  @ApiOperation({ summary: 'Crear un nuevo movimiento de inventario' })
  @ApiResponse({ status: 201, description: 'Movimiento creado exitosamente', type: MovimientoInventario })
  @ApiResponse({ status: 409, description: 'Stock insuficiente para esta salida' })
  createMovimiento(@Body() createMovimientoDto: CreateMovimientoDto) {
    return this.inventarioService.createMovimiento(createMovimientoDto);
  }

  @Get('movimientos')
  @ApiOperation({ summary: 'Obtener todos los movimientos de inventario' })
  @ApiResponse({ status: 200, description: 'Lista de movimientos', type: [MovimientoInventario] })
  findAllMovimientos() {
    return this.inventarioService.findAllMovimientos();
  }

  @Get('movimientos/:id')
  @ApiOperation({ summary: 'Obtener un movimiento por ID' })
  @ApiParam({ name: 'id', description: 'ID del movimiento' })
  @ApiResponse({ status: 200, description: 'Movimiento encontrado', type: MovimientoInventario })
  @ApiResponse({ status: 404, description: 'Movimiento no encontrado' })
  findMovimientoById(@Param('id') id: string) {
    return this.inventarioService.findMovimientoById(+id);
  }

  @Patch('movimientos/:id')
  @ApiOperation({ summary: 'Actualizar un movimiento' })
  @ApiParam({ name: 'id', description: 'ID del movimiento' })
  @ApiResponse({ status: 200, description: 'Movimiento actualizado', type: MovimientoInventario })
  @ApiResponse({ status: 404, description: 'Movimiento no encontrado' })
  updateMovimiento(@Param('id') id: string, @Body() updateMovimientoDto: UpdateMovimientoDto) {
    return this.inventarioService.updateMovimiento(+id, updateMovimientoDto);
  }

  @Delete('movimientos/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un movimiento' })
  @ApiParam({ name: 'id', description: 'ID del movimiento' })
  @ApiResponse({ status: 204, description: 'Movimiento eliminado' })
  @ApiResponse({ status: 404, description: 'Movimiento no encontrado' })
  removeMovimiento(@Param('id') id: string) {
    return this.inventarioService.removeMovimiento(+id);
  }

  // ============ PROVEEDORES ============
  @Post('proveedores')
  @ApiOperation({ summary: 'Crear un nuevo proveedor' })
  @ApiResponse({ status: 201, description: 'Proveedor creado exitosamente', type: Proveedor })
  @ApiResponse({ status: 409, description: 'El proveedor con este RUT ya existe' })
  createProveedor(@Body() createProveedorDto: CreateProveedorDto) {
    return this.inventarioService.createProveedor(createProveedorDto);
  }

  @Get('proveedores')
  @ApiOperation({ summary: 'Obtener todos los proveedores' })
  @ApiResponse({ status: 200, description: 'Lista de proveedores', type: [Proveedor] })
  findAllProveedores() {
    return this.inventarioService.findAllProveedores();
  }

  @Get('proveedores/:id')
  @ApiOperation({ summary: 'Obtener un proveedor por ID' })
  @ApiParam({ name: 'id', description: 'ID del proveedor' })
  @ApiResponse({ status: 200, description: 'Proveedor encontrado', type: Proveedor })
  @ApiResponse({ status: 404, description: 'Proveedor no encontrado' })
  findProveedorById(@Param('id') id: string) {
    return this.inventarioService.findProveedorById(+id);
  }

  @Patch('proveedores/:id')
  @ApiOperation({ summary: 'Actualizar un proveedor' })
  @ApiParam({ name: 'id', description: 'ID del proveedor' })
  @ApiResponse({ status: 200, description: 'Proveedor actualizado', type: Proveedor })
  @ApiResponse({ status: 404, description: 'Proveedor no encontrado' })
  updateProveedor(@Param('id') id: string, @Body() updateProveedorDto: UpdateProveedorDto) {
    return this.inventarioService.updateProveedor(+id, updateProveedorDto);
  }

  @Delete('proveedores/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un proveedor' })
  @ApiParam({ name: 'id', description: 'ID del proveedor' })
  @ApiResponse({ status: 204, description: 'Proveedor eliminado' })
  @ApiResponse({ status: 404, description: 'Proveedor no encontrado' })
  removeProveedor(@Param('id') id: string) {
    return this.inventarioService.removeProveedor(+id);
  }

  // ============ ENDPOINTS ESPECIALES ============
  @Get('productos/stock-bajo')
  @ApiOperation({ summary: 'Obtener productos con stock bajo' })
  @ApiResponse({ status: 200, description: 'Productos con stock bajo', type: [Producto] })
  getProductosBajoStock() {
    return this.inventarioService.getProductosBajoStock();
  }

  @Get('productos/por-vencer')
  @ApiOperation({ summary: 'Obtener productos próximos a vencer' })
  @ApiQuery({ name: 'dias', description: 'Días para vencimiento', required: false })
  @ApiResponse({ status: 200, description: 'Productos próximos a vencer', type: [Producto] })
  getProductosPorVencer(@Query('dias') dias?: number) {
    return this.inventarioService.getProductosPorVencer(dias ? +dias : 30);
  }

  @Get('movimientos/producto/:productoId')
  @ApiOperation({ summary: 'Obtener movimientos por producto' })
  @ApiParam({ name: 'productoId', description: 'ID del producto' })
  @ApiResponse({ status: 200, description: 'Movimientos del producto', type: [MovimientoInventario] })
  getMovimientosPorProducto(@Param('productoId') productoId: string) {
    return this.inventarioService.getMovimientosPorProducto(+productoId);
  }

  @Get('reportes/stock-por-categoria')
  @ApiOperation({ summary: 'Obtener reporte de stock por categoría' })
  @ApiResponse({ status: 200, description: 'Reporte de stock por categoría' })
  getReporteStockPorCategoria() {
    return this.inventarioService.getReporteStockPorCategoria();
  }
}
