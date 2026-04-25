import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface SolicitarRecuperacionDto {
  email: string;
}

interface ResetPasswordDto {
  token: string;
  nuevaContrasena: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecoveryService {
  private apiUrl = 'http://localhost:3000/recuperar';

  constructor(private http: HttpClient) {}

  solicitarRecuperacion(dto: SolicitarRecuperacionDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/solicitar`, dto);
  }

  resetPassword(dto: ResetPasswordDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/resetear`, dto);
  }
}
