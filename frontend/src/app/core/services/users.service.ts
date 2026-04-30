import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  documentType?: string;
  documentNumber?: string;
  age?: number;
  address?: string;
  isActive?: boolean;
  roleId?: number;
  avatar?: string;
}

interface UpdateUserDto {
  username?: string;
  email?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  documentType?: string;
  documentNumber?: string;
  age?: number;
  address?: string;
  isActive?: boolean;
  roleId?: number;
  avatar?: string;
}

interface User {
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
  isActive: boolean;
  roleId?: number;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  createUser(userDto: CreateUserDto): Observable<User> {
    return this.http.post<User>(this.apiUrl, userDto);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  updateUser(id: number, updateUserDto: any): Observable<User> {
    if (updateUserDto instanceof FormData) {
      return this.http.patch<User>(`${this.apiUrl}/${id}`, updateUserDto, {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        })
      });
    }
    return this.http.patch<User>(`${this.apiUrl}/${id}`, updateUserDto, { headers: this.getAuthHeaders() });
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
