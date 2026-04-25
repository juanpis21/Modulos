import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
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

    // Verificar si es superadmin (1) o admin (2)
    if (currentUser.roleId !== 1 && currentUser.roleId !== 2) {
      this.router.navigate(['/inicio']); // Redirigir a inicio si no es admin
      return false;
    }

    return true;
  }
}
