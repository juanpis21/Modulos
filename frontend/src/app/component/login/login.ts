import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  credentials = {
    username: '',
    password: ''
  };
  isLoading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onSubmit(): void {
    console.log('Login attempt started with:', this.credentials.username);
    if (!this.credentials.username || !this.credentials.password) {
      this.errorMessage = 'Por favor, completa todos los campos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.isLoading = false;
        
        // Redirigir según el rol del usuario
        const userRoleId = response.user.roleId;
        console.log('🔍 [Login] roleId encontrado:', userRoleId);
        console.log('🔍 [Login] datos completos del usuario:', response.user);
        
        if (userRoleId) {
          console.log('🚀 [Login] Redirigiendo por roleId:', userRoleId);
          this.redirectByRole(userRoleId);
        } else {
          console.log('⚠️ [Login] No se encontró roleId, redirigiendo a inicio');
          this.router.navigate(['/inicio']); // Redirigir a inicio por defecto si no tiene rol
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Login error full details:', error);
        if (error.status === 0) {
          this.errorMessage = '❌ No se pudo conectar con el servidor. Verifica que el backend esté corriendo en el puerto 3000.';
        } else if (error.status === 401) {
          this.errorMessage = '❌ Credenciales incorrectas. Verifica tu usuario/email y contraseña.';
        } else {
          this.errorMessage = '❌ Error inesperado: ' + (error.error?.message || error.message);
        }
      }
    });
  }

  private redirectByRole(roleId: number): void {
    console.log('🎯 [Login] Ejecutando redirectByRole con roleId:', roleId);
    
    switch (roleId) {
      case 1: 
        console.log('👑 [Login] Redirigiendo SuperAdmin a /panel-admin');
        this.router.navigate(['/panel-admin']);
        break;
      case 2: 
        console.log('👤 [Login] Redirigiendo Admin a /panel-admin');
        this.router.navigate(['/panel-admin']);
        break;
      case 3: 
        console.log('🩺 [Login] Redirigiendo Veterinario a /perfil-veterinario');
        this.router.navigate(['/perfil-veterinario']);
        break;
      case 4: 
        console.log('👥 [Login] Redirigiendo Usuario a /inicio');
        this.router.navigate(['/inicio']);
        break;
      default:
        console.log('❓ [Login] Rol desconocido, redirigiendo a /inicio');
        this.router.navigate(['/inicio']);
    }
  }
}

