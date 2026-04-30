import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const currentUser = this.authService.getCurrentUser();
    
    // Verificar si el usuario está logueado
    if (!currentUser) {
      this.router.navigate(['/login']);
      return false;
    }

    const requiredRoles = route.data['roles'] as number[];
    if (requiredRoles && requiredRoles.length > 0) {
      const userRoleId = currentUser.roleId;
      
      if (!requiredRoles.includes(userRoleId)) {
        this.redirectByRole(userRoleId);
        return false;
      }
    }

    return true;
  }

  private redirectByRole(roleId: number): void {
    switch (roleId) {
      case 1: // Superadmin
        this.router.navigate(['/panel-admin']);
        break;
      case 2: // Admin
        this.router.navigate(['/panel-admin']);
        break;
      case 3: // Veterinario
        this.router.navigate(['/perfil-veterinario']);
        break;
      case 4: // Usuario
        this.router.navigate(['/inicio']);
        break;
      default:
        this.router.navigate(['/inicio']);
    }
  }
}
