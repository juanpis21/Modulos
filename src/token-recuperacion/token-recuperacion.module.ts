import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenRecuperacionService } from './token-recuperacion.service';
import { TokenRecuperacionController } from './token-recuperacion.controller';
import { TokenRecuperacion } from './entities/token-recuperacion.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TokenRecuperacion]),
    UsersModule
  ],
  controllers: [TokenRecuperacionController],
  providers: [TokenRecuperacionService],
})
export class TokenRecuperacionModule {}
