import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Permission {
  id: number;
  moduleName: string;
  canAccess: boolean;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  private apiUrl = 'http://localhost:3000/permissions';
  private permissions: Permission[] = [];

  constructor(private http: HttpClient) {}

  getMyPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${this.apiUrl}/my-permissions`);
  }

  checkPermission(moduleName: string): Observable<{ hasAccess: boolean }> {
    return this.http.get<{ hasAccess: boolean }>(`${this.apiUrl}/check/${moduleName}`);
  }

  loadPermissions(): void {
    this.getMyPermissions().subscribe({
      next: (permissions) => {
        this.permissions = permissions;
        localStorage.setItem('user_permissions', JSON.stringify(permissions));
      },
      error: (err) => {
        console.error('❌ Error al cargar permisos:', err);
      }
    });
  }

  hasModuleAccess(moduleName: string): boolean {
    const stored = localStorage.getItem('user_permissions');
    if (stored) {
      this.permissions = JSON.parse(stored);
    }
    const permission = this.permissions.find(p => p.moduleName === moduleName);
    return permission ? permission.canAccess : false;
  }

  canCreate(moduleName: string): boolean {
    const stored = localStorage.getItem('user_permissions');
    if (stored) {
      this.permissions = JSON.parse(stored);
    }
    const permission = this.permissions.find(p => p.moduleName === moduleName);
    return permission ? permission.canCreate : false;
  }

  canRead(moduleName: string): boolean {
    const stored = localStorage.getItem('user_permissions');
    if (stored) {
      this.permissions = JSON.parse(stored);
    }
    const permission = this.permissions.find(p => p.moduleName === moduleName);
    return permission ? permission.canRead : false;
  }

  canUpdate(moduleName: string): boolean {
    const stored = localStorage.getItem('user_permissions');
    if (stored) {
      this.permissions = JSON.parse(stored);
    }
    const permission = this.permissions.find(p => p.moduleName === moduleName);
    return permission ? permission.canUpdate : false;
  }

  canDelete(moduleName: string): boolean {
    const stored = localStorage.getItem('user_permissions');
    if (stored) {
      this.permissions = JSON.parse(stored);
    }
    const permission = this.permissions.find(p => p.moduleName === moduleName);
    return permission ? permission.canDelete : false;
  }

  clearPermissions(): void {
    this.permissions = [];
    localStorage.removeItem('user_permissions');
  }
}
