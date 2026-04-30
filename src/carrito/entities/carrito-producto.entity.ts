import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Carrito } from './carrito.entity';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('carrito_productos')
export class CarritoProducto {
  @ApiProperty({ 
    description: 'ID único del item en el carrito', 
    example: 1 
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ 
    description: 'Cantidad del producto', 
    example: 2 
  })
  @Column({ type: 'int' })
  cantidad: number;

  @ApiProperty({ 
    description: 'Precio unitario al momento de agregar al carrito', 
    example: 25000 
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precioUnitario: number;

  @ApiProperty({ 
    description: 'ID del carrito', 
    example: 1 
  })
  @Column({ name: 'carritoId' })
  carritoId: number;

  @ApiProperty({ 
    description: 'Carrito al que pertenece este item', 
    type: () => Carrito 
  })
  @ManyToOne(() => Carrito)
  carrito: Carrito;

  @ApiProperty({ 
    description: 'ID del producto', 
    example: 1 
  })
  @Column({ name: 'productoId' })
  productoId: number;

  @ApiProperty({ 
    description: 'Producto agregado al carrito', 
    type: () => Producto 
  })
  @ManyToOne(() => Producto)
  producto: Producto;
}
