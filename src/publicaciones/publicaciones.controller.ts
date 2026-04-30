import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { PublicacionesService } from './publicaciones.service';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';
import { Publicacion } from './entities/publicacion.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('publicaciones')
@Controller('publicaciones')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva publicación' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        descripcion: { type: 'string' },
        autorId: { type: 'number' },
        imagen: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Publicación creada exitosamente', type: Publicacion })
  @ApiResponse({ status: 409, description: 'La publicación ya existe' })
  @UseInterceptors(FileInterceptor('imagen', {
    storage: diskStorage({
      destination: './uploads/publicaciones',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        cb(null, `pub_${uniqueSuffix}${ext}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
        cb(new BadRequestException('Solo se permiten imágenes (jpg, jpeg, png, gif, webp)'), false);
      } else {
        cb(null, true);
      }
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  }))
  async create(@Request() req, @Body() createPublicacionDto: CreatePublicacionDto, @UploadedFile() file?: Express.Multer.File) {
    const { userId } = req.user;
    
    // Si no se proporciona autorId, se asigna al usuario autenticado
    if (!createPublicacionDto.autorId) {
      createPublicacionDto.autorId = userId;
    }

    // Si se subió una imagen, guardar la ruta relativa
    if (file) {
      createPublicacionDto.imagen = `/uploads/publicaciones/${file.filename}`;
    }

    return await this.publicacionesService.create(createPublicacionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las publicaciones' })
  @ApiResponse({ status: 200, description: 'Lista de publicaciones', type: [Publicacion] })
  async findAll() {
    return await this.publicacionesService.findAll();
  }

  @Get('autor/:autorId')
  @ApiOperation({ summary: 'Obtener publicaciones por autor' })
  @ApiResponse({ status: 200, description: 'Lista de publicaciones del autor', type: [Publicacion] })
  async findByAutor(@Param('autorId') autorId: string) {
    return await this.publicacionesService.findByAutor(+autorId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una publicación por ID' })
  @ApiResponse({ status: 200, description: 'Publicación encontrada', type: Publicacion })
  @ApiResponse({ status: 404, description: 'Publicación no encontrada' })
  async findOne(@Param('id') id: string) {
    return await this.publicacionesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una publicación' })
  @ApiResponse({ status: 200, description: 'Publicación actualizada', type: Publicacion })
  @ApiResponse({ status: 404, description: 'Publicación no encontrada' })
  async update(@Param('id') id: string, @Body() updatePublicacionDto: UpdatePublicacionDto) {
    return await this.publicacionesService.update(+id, updatePublicacionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una publicación (soft delete)' })
  @ApiResponse({ status: 200, description: 'Publicación eliminada' })
  @ApiResponse({ status: 404, description: 'Publicación no encontrada' })
  async remove(@Param('id') id: string) {
    return await this.publicacionesService.remove(+id);
  }
}
