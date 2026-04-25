import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
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
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('current_user', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
        console.log('✅ [AuthService] Login exitoso:', response.user.username);
        console.log('🔑 [AuthService] Rol del usuario:', response.user.roleId ?? 'sin rol');
      })
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('current_user');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  updateCurrentUser(user: any): void {
    console.log('[AuthService] Actualizando usuario:', user);
    localStorage.setItem('current_user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private loadUserFromStorage(): void {
    const user = localStorage.getItem('current_user');
    if (user) {
      const parsed = JSON.parse(user);
      this.currentUserSubject.next(parsed);
      console.log('📦 [AuthService] Usuario cargado desde storage:', parsed.username);
      console.log('🔑 [AuthService] Rol del usuario:', parsed.roleId ?? 'sin rol');
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
}
