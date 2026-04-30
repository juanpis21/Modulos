import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    username: string;
    email: string;
    fullName: string;
    firstName: string;
    lastName: string;
    phone: string;
    documentType: string;
    documentNumber: string;
    age: number;
    address: string;
    avatar: string;
    roleId?: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    role?: {
      id: number;
      name: string;
      description: string;
      modules?: any[];
    };
  };
}

interface LoginCredentials {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';
  private _authStatus = signal<LoginResponse | null>(null);
  
  public currentUser = computed(() => this._authStatus()?.user);
  public isAuthenticated = computed(() => !!this._authStatus());

  public userModules = computed(() => {
    const user = this._authStatus()?.user;
    if (!user || !user.role) return [];

    const role = user.role;
    if (!role.modules) return [];

    return role.modules.map((m: any) => m.name.toLowerCase().trim());
  });

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        try {
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('auth_status', JSON.stringify(response));
          this._authStatus.set(response);
          console.log('✅ [AuthService] Login exitoso:', response.user.username);
          console.log('🔐 [AuthService] Módulos del usuario:', this.userModules());
        } catch (e: any) {
          if (e.name === 'QuotaExceededError') {
            console.warn('⚠️ [AuthService] localStorage lleno, limpiando...');
            this.clearStorage();
            try {
              localStorage.setItem('access_token', response.access_token);
              this._authStatus.set(response);
              console.log('✅ [AuthService] Token guardado después de limpiar storage');
            } catch (e2: any) {
              console.warn('⚠️ [AuthService] No se pudo guardar ni el token después de limpiar, usando memoria temporal');
              this._authStatus.set(response);
            }
          } else {
            throw e;
          }
        }
      })
    );
  }

  logout(): void {
    this.clearStorage();
    this._authStatus.set(null);
  }

  private clearStorage(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('current_user');
    localStorage.removeItem('user_permissions');
    localStorage.removeItem('auth_status');
    localStorage.removeItem('user_avatar');
  }

  getCurrentUser(): any {
    return this.currentUser();
  }

  updateCurrentUser(user: any): void {
    console.log('[AuthService] Actualizando usuario:', user);
    const currentStatus = this._authStatus();
    if (currentStatus) {
      const updated = {
        ...currentStatus,
        user: { ...currentStatus.user, ...user }
      };
      this._authStatus.set(updated);
      try {
        localStorage.setItem('auth_status', JSON.stringify(updated));
      } catch (e: any) {
        if (e.name === 'QuotaExceededError') {
          console.warn('⚠️ [AuthService] localStorage lleno, no se pudo guardar estado actualizado');
        }
      }
    }
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private loadUserFromStorage(): void {
    const savedStatus = localStorage.getItem('auth_status');
    if (savedStatus) {
      try {
        const parsed = JSON.parse(savedStatus);
        this._authStatus.set(parsed);
        console.log('📦 [AuthService] Estado de autenticación restaurado desde storage');
      } catch (e) {
        console.error('❌ [AuthService] Error al restaurar estado:', e);
        localStorage.removeItem('auth_status');
      }
    } else {
      // Si hay token pero no auth_status (caso de localStorage lleno), recargar desde backend
      const token = this.getToken();
      if (token) {
        console.log('🔄 [AuthService] Token existe pero no auth_status, recargando usuario...');
        this.reloadUser();
      }
    }
  }

  getUserFromToken(): any {
    const token = this.getToken();
    if (token) {
      try {
        return jwtDecode(token);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  async reloadUser(): Promise<void> {
    const token = this.getToken();
    if (!token) return;

    try {
      const userFromToken = this.getUserFromToken();
      if (userFromToken) {
        const response = await this.http.get<LoginResponse>(`${this.apiUrl}/check-status`).toPromise();
        if (response) {
          this._authStatus.set(response);
          try {
            localStorage.setItem('auth_status', JSON.stringify(response));
          } catch (e: any) {
            if (e.name === 'QuotaExceededError') {
              console.warn('⚠️ [AuthService] localStorage lleno, no se pudo guardar estado recargado');
            }
          }
          console.log('🔄 [AuthService] Usuario recargado desde backend');
        }
      }
    } catch (e) {
      console.error('❌ [AuthService] Error al recargar usuario:', e);
      this.logout();
    }
  }
}
