import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { TokenRecuperacion } from './entities/token-recuperacion.entity';
import { SolicitarRecuperacionDto } from './dto/solicitar-recuperacion.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UsersService } from '../users/users.service';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class TokenRecuperacionService {
  constructor(
    @InjectRepository(TokenRecuperacion)
    private tokenRepository: Repository<TokenRecuperacion>,
    private usersService: UsersService,
    private mailerService: MailerService,
  ) { }

  async solicitarRecuperacion(dto: SolicitarRecuperacionDto): Promise<{ mensaje: string, tokenSimulado: string }> {
    const usuario = await this.usersService.findByEmail(dto.email);
    if (!usuario) {
      throw new NotFoundException(`El correo electrónico ${dto.email} no está registrado en la base de datos.`);
    }

    await this.tokenRepository.delete({ usuarioId: usuario.id });

    const nuevoToken = crypto.randomBytes(32).toString('hex');
    const fechaExpiracion = new Date();
    fechaExpiracion.setMinutes(fechaExpiracion.getMinutes() + 5);

    const ticket = this.tokenRepository.create({
      token: nuevoToken,
      usuarioId: usuario.id,
      fechaExpiracion,
    });

    await this.tokenRepository.save(ticket);

    try {
      await this.mailerService.sendMail({
        to: usuario.email,
        subject: 'Recuperación de Contraseña - HelpyourPet',
        html: `
          <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
            <h2 style="color: #4CAF50;">Clínica Veterinaria HelpyourPet</h2>
            <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
            <p>Por favor, usa el siguiente código de seguridad en tu aplicación. Recuerda que expirará en <b>10 MINUTOS</b>.</p>
            <div style="margin: 20px auto; padding: 15px; background: #f2f2f2; border-radius: 5px; font-size: 24px; font-weight: bold; letter-spacing: 2px;">
              ${nuevoToken}
            </div>
            <p style="font-size: 12px; color: #777;">Si no solicitaste este código, puedes ignorar este correo de forma segura.</p>
          </div>
        `,
      });
    } catch (e) {
      console.log('Error enviando correo SMTP: ', e.message);
      throw new InternalServerErrorException('Error enviando correo SMTP: ' + e.message);
    }

    return { 
      mensaje: 'Recuperación inicializada con éxito. Úselo rápido porque caducará pronto.',
      tokenSimulado: 'Enviado por correo electrónico.' 
    };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ mensaje: string }> {
    // 1. Validamos que el ticket exista
    const ticket = await this.tokenRepository.findOne({ where: { token: dto.token } });

    if (!ticket) {
      throw new BadRequestException('El Token de Recuperación es inválido o nunca fue creado.');
    }

    const hoy = new Date();
    if (hoy > ticket.fechaExpiracion) {
      await this.tokenRepository.delete(ticket.id);
      throw new BadRequestException('El Token ha superado sus 10 minutos de vida. Debe solicitar uno nuevo.');
    }

    const usuario = await this.usersService.findOne(ticket.usuarioId);
    if (!usuario) {
      throw new NotFoundException('Usuario asociado al token ya no existe.');
    }
    
    await this.usersService.update(usuario.id, { password: dto.nuevaContrasena });
    await this.tokenRepository.delete(ticket.id);

    return { mensaje: 'Contraseña actualizada con éxito!' };
  }
}
