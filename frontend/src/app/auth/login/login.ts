import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

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
        
        // Redirigir según permisos
        this.redirectByPermissions();
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

  private redirectByPermissions(): void {
    console.log('🎯 [Login] Ejecutando redirectByPermissions');
    
    // Lista de módulos en orden de prioridad
    const modulePriority = [
      'inicio',
      'perfil-usuario',
      'perfil-veterinario',
      'panel-admin',
      'sobre-nosotros',
      'adopcion',
      'tienda',
      'reporte',
      'calificacion',
      'veterinario',
      'servicios',
      'pasarela-pagos',
    ];

    // Buscar el primer módulo al que tiene acceso
    const userModules = this.authService.userModules();
    for (const moduleName of modulePriority) {
      if (userModules.includes(moduleName)) {
        console.log(`✅ [Login] Redirigiendo a módulo permitido: ${moduleName}`);
        this.router.navigate([`/${moduleName}`]);
        return;
      }
    }

    // Si no tiene acceso a ningún módulo, redirigir a inicio como fallback
    console.log('⚠️ [Login] Usuario no tiene acceso a ningún módulo, redirigiendo a inicio');
    this.router.navigate(['/inicio']);
  }
}

