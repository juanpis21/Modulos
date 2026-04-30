import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize, timeout } from 'rxjs/operators';
import { RecoveryService } from '../../core/services/recovery.service';

@Component({
  selector: 'app-recovery',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recovery.html',
  styleUrl: './recovery.scss'
})
export class Recovery implements OnInit {
  // Step 1: Request Token
  email = '';
  
  // Step 2: Reset Password
  token = '';
  nuevaContrasena = '';
  confirmarContrasena = '';
  
  isLoading = false;
  message = '';
  messageType = ''; // 'success' or 'error'
  isResetMode = false;

  constructor(
    private recoveryService: RecoveryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log('RecoveryComponent loaded');
    // Check if there is a token in the URL
    this.route.queryParams.subscribe(params => {
      if (params['token']) {
        this.token = params['token'];
        this.isResetMode = true;
      }
    });
  }

  onSubmit(): void {
    if (this.isResetMode) {
      this.handleResetPassword();
    } else {
      this.handleSolicitarRecuperacion();
    }
  }

  handleSolicitarRecuperacion(): void {
    if (!this.email) {
      this.message = 'Por favor, ingresa tu correo electrónico';
      this.messageType = 'error';
      return;
    }

    this.isLoading = true;
    this.message = '';

    this.recoveryService.solicitarRecuperacion({ email: this.email })
      .pipe(
        timeout(15000),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          console.log('Recovery success:', response);
          const successMsg = '✅ ¡Código enviado! Revisa tu bandeja de entrada.';
          this.message = successMsg;
          this.messageType = 'success';
          
          // Alerta nativa que el usuario confirmó que funcionaba
          alert(successMsg);
          
          setTimeout(() => {
            this.isResetMode = true;
          }, 3000);
        },
        error: (error) => {
          console.error('Recovery error:', error);
          this.message = '❌ Error: ' + (error.error?.message || 'No se pudo procesar la solicitud.');
          this.messageType = 'error';
        }
      });
  }

  handleResetPassword(): void {
    if (!this.token || !this.nuevaContrasena || !this.confirmarContrasena) {
      this.message = 'Por favor, completa todos los campos (código y contraseña)';
      this.messageType = 'error';
      return;
    }

    if (this.nuevaContrasena !== this.confirmarContrasena) {
      this.message = 'Las contraseñas no coinciden';
      this.messageType = 'error';
      return;
    }

    if (this.nuevaContrasena.length < 6) {
      this.message = 'La contraseña debe tener al menos 6 caracteres';
      this.messageType = 'error';
      return;
    }

    this.isLoading = true;
    this.message = '';

    this.recoveryService.resetPassword({ 
      token: this.token, 
      nuevaContrasena: this.nuevaContrasena 
    }).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.message = '✅ Contraseña restablecida con éxito. Redirigiendo al login...';
        this.messageType = 'success';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        this.isLoading = false;
        this.message = '❌ Error al restablecer contraseña: ' + (error.error?.message || 'Token inválido o expirado');
        this.messageType = 'error';
        console.error('Reset error:', error);
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
