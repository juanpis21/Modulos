import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-panel-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panel-admin.html',
  styleUrl: './panel-admin.scss',
})
export class PanelAdmin implements OnInit {
  usuarios: any[] = [];
  stats = {
    usuariosActivos: 0,
    mascotasRegistradas: 0,
    veterinariasActivas: 0
  };

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usersService.getAllUsers().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.actualizarStats();
      },
      error: (err) => console.error('Error al cargar usuarios:', err)
    });
  }

  actualizarStats(): void {
    this.stats.usuariosActivos = this.usuarios.filter(u => u.isActive).length;
    // Las otras stats se cargarán cuando existan los servicios correspondientes
  }

  getRolesString(usuario: any): string {
    if (!usuario.role || !usuario.role.name) return 'Sin rol';
    return usuario.role.name;
  }

  toggleEstado(usuario: any): void {
    // Lógica para activar/desactivar usuario
    const nuevoEstado = !usuario.isActive;
    this.usersService.updateUser(usuario.id, { isActive: nuevoEstado }).subscribe({
      next: () => this.cargarUsuarios(),
      error: (err) => alert('Error al cambiar estado: ' + err.message)
    });
  }

  // Métodos para el manejo de la UI (modales, secciones, etc.)
  seccionActiva: string = 'dashboard';
  
  cambiarSeccion(id: string): void {
    this.seccionActiva = id;
  }

  modalAbierto: string | null = null;
  abrirModal(id: string): void {
    this.modalAbierto = id;
  }
  cerrarModal(): void {
    this.modalAbierto = null;
  }
}
