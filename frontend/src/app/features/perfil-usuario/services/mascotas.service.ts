import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Mascota {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  edad: number;
  genero: string;
  tamano: string;
  descripcion: string;
  foto: string;
  unidadEdad: string;
  usuario?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class MascotasService {
  private apiUrl = 'http://localhost:3000/pets';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getAllMascotas(): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  getMascotaById(id: number): Observable<Mascota> {
    return this.http.get<Mascota>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  getMascotasByUsuario(usuarioId: number): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(`${this.apiUrl}/owner/${usuarioId}`, {
      headers: this.getAuthHeaders()
    });
  }

  getMascotasByEspecie(especie: string): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(`${this.apiUrl}/especie/${especie}`, {
      headers: this.getAuthHeaders()
    });
  }

  createMascota(mascota: any): Observable<Mascota> {
    if (mascota instanceof FormData) {
      return this.http.post<Mascota>(this.apiUrl, mascota, {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        })
      });
    }
    return this.http.post<Mascota>(this.apiUrl, mascota, {
      headers: this.getAuthHeaders()
    });
  }

  updateMascota(id: number, mascota: any): Observable<Mascota> {
    if (mascota instanceof FormData) {
      return this.http.patch<Mascota>(`${this.apiUrl}/${id}`, mascota, {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        })
      });
    }
    return this.http.patch<Mascota>(`${this.apiUrl}/${id}`, mascota, {
      headers: this.getAuthHeaders()
    });
  }

  deleteMascota(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
