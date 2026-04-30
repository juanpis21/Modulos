import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class VeterinarioGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(): boolean {
    const currentUser = this.authService.getCurrentUser();
    
    // Verificar si está logueado
    if (!currentUser) {
      this.router.navigate(['/login']);
      return false;
    }

    // Verificar si es veterinario (roleId = 3)
    if (currentUser.roleId !== 3) {
      this.router.navigate(['/inicio']); // Redirigir a inicio si no es veterinario
      return false;
    }

    return true;
  }
}
