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
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Pet } from './entities/pet.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('pets')
@Controller('pets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva mascota' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        species: { type: 'string' },
        breed: { type: 'string' },
        age: { type: 'number' },
        gender: { type: 'string' },
        color: { type: 'string' },
        weight: { type: 'number' },
        description: { type: 'string' },
        foto: { type: 'string', format: 'binary' },
        ownerId: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Mascota creada exitosamente', type: Pet })
  @ApiResponse({ status: 409, description: 'La mascota ya existe' })
  @UseInterceptors(FileInterceptor('foto', {
    storage: diskStorage({
      destination: './uploads/pets',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        cb(null, `pet_${uniqueSuffix}${ext}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
        cb(new BadRequestException('Solo se permiten imágenes'), false);
      } else {
        cb(null, true);
      }
    },
    limits: { fileSize: 5 * 1024 * 1024 },
  }))
  async create(@Request() req, @Body() createPetDto: CreatePetDto, @UploadedFile() file?: Express.Multer.File) {
    const { userId, roles } = req.user;
    
    // Si NO es admin, superadmin ni veterinario, forzamos que el dueño sea él mismo
    const rolesAutorizados = ['admin', 'superadmin', 'veterinario'];
    const userRoles = roles || [];
    const tienePermisoEspecial = userRoles.some(role => rolesAutorizados.includes(role));
    
    if (!tienePermisoEspecial) {
      console.log(`[SECURITY-PETS] Forzando ownerId ${userId} para el usuario ${req.user.username}`);
      createPetDto.ownerId = userId;
    } else if (!createPetDto.ownerId) {
      // Si es admin pero no puso ownerId, le asignamos la mascota a él mismo por defecto
      createPetDto.ownerId = userId;
    }

    if (file) {
      createPetDto.foto = `/uploads/pets/${file.filename}`;
    }

    return await this.petsService.create(createPetDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las mascotas' })
  @ApiResponse({ status: 200, description: 'Lista de mascotas', type: [Pet] })
  findAll() {
    return this.petsService.findAll();
  }

  @Get('owner/:ownerId')
  @ApiOperation({ summary: 'Obtener mascotas por dueño' })
  @ApiParam({ name: 'ownerId', description: 'ID del dueño' })
  @ApiResponse({ status: 200, description: 'Lista de mascotas del dueño', type: [Pet] })
  @ApiResponse({ status: 404, description: 'Dueño no encontrado' })
  findByOwner(@Param('ownerId') ownerId: string) {
    return this.petsService.findByOwnerId(+ownerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una mascota por ID' })
  @ApiParam({ name: 'id', description: 'ID de la mascota' })
  @ApiResponse({ status: 200, description: 'Mascota encontrada', type: Pet })
  @ApiResponse({ status: 404, description: 'Mascota no encontrada' })
  findOne(@Param('id') id: string) {
    return this.petsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una mascota' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        species: { type: 'string' },
        breed: { type: 'string' },
        age: { type: 'number' },
        gender: { type: 'string' },
        color: { type: 'string' },
        weight: { type: 'number' },
        description: { type: 'string' },
        foto: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiParam({ name: 'id', description: 'ID de la mascota' })
  @ApiResponse({ status: 200, description: 'Mascota actualizada', type: Pet })
  @ApiResponse({ status: 404, description: 'Mascota no encontrada' })
  @UseInterceptors(FileInterceptor('foto', {
    storage: diskStorage({
      destination: './uploads/pets',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        cb(null, `pet_${uniqueSuffix}${ext}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
        cb(new BadRequestException('Solo se permiten imágenes'), false);
      } else {
        cb(null, true);
      }
    },
    limits: { fileSize: 5 * 1024 * 1024 },
  }))
  update(@Param('id') id: string, @Body() updatePetDto: UpdatePetDto, @UploadedFile() file?: Express.Multer.File) {
    if (file) {
      updatePetDto.foto = `/uploads/pets/${file.filename}`;
    }
    return this.petsService.update(+id, updatePetDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una mascota' })
  @ApiParam({ name: 'id', description: 'ID de la mascota' })
  @ApiResponse({ status: 204, description: 'Mascota eliminada' })
  @ApiResponse({ status: 404, description: 'Mascota no encontrada' })
  remove(@Param('id') id: string) {
    return this.petsService.remove(+id);
  }
}
