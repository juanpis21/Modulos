import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../../core/services/users.service';
import { MascotasService, Mascota } from '../../perfil-usuario/services/mascotas.service';

@Component({
  selector: 'app-panel-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panel-admin.html',
  styleUrl: './panel-admin.scss',
})
export class PanelAdmin implements OnInit {
  usuarios: any[] = [];
  mascotas: Mascota[] = [];
  stats = {
    usuariosActivos: 0,
    mascotasRegistradas: 0,
    veterinariasActivas: 0
  };

  constructor(
    private usersService: UsersService,
    private mascotasService: MascotasService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarMascotas();
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
    this.stats.mascotasRegistradas = this.mascotas.length;
    // Las otras stats se cargarán cuando existan los servicios correspondientes
  }

  cargarMascotas(): void {
    this.mascotasService.getAllMascotas().subscribe({
      next: (data) => {
        this.mascotas = data;
        this.actualizarStats();
      },
      error: (err) => console.error('Error al cargar mascotas:', err)
    });
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

  // Métodos para el manejo de mascotas
  eliminarMascota(mascota: Mascota): void {
    if (confirm(`¿Estás seguro de que quieres eliminar a ${mascota.nombre}?`)) {
      this.mascotasService.deleteMascota(mascota.id).subscribe({
        next: () => {
          this.cargarMascotas();
          alert('Mascota eliminada exitosamente');
        },
        error: (err) => alert('Error al eliminar mascota: ' + err.message)
      });
    }
  }

  verDetallesMascota(mascota: Mascota): void {
    // Implementar lógica para mostrar detalles de mascota
    console.log('Ver detalles de mascota:', mascota);
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
