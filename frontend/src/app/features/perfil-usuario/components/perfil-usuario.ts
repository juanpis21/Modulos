import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';
import { UsersService } from '../../../core/services/users.service';
import { MascotasService } from '../services/mascotas.service';
import { PublicacionesService } from '../../inicio/services/publicaciones.service';

interface Mascota {
  id: number;
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: string;
  color: string;
  weight: number;
  description: string;
  ownerId: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Usuario {
  id: number;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  edad: number;
  tipoDocumento: string;
  numDocumento: string;
  direccion: string;
  imagen: string;
  roleId?: number;
}

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './perfil-usuario.html',
  styleUrl: './perfil-usuario.scss'
})
export class PerfilUsuario implements OnInit {
  seccionActiva = 'dashboard';
  sidebarAbierto = false;
  darkMode = false;

  usuario: Usuario = {
    id: 1,
    nombres: 'Juan Carlos',
    apellidos: 'Pérez García',
    correo: 'juan.perez@email.com',
    telefono: '+57 320 456 7890',
    edad: 28,
    direccion: 'Calle 15 #10-20, Duitama, Boyacá',
    tipoDocumento: 'Cédula de Ciudadanía',
    numDocumento: '1052345678',
    imagen: '',
    roleId: undefined
  };

  mascotas: any[] = [];
  publicaciones: any[] = [];

  // Modal state
  showAddPetModal = false;
  showEditPetModal = false;
  newPetImagePreview: string | null = null;
  editingPetImagePreview: string | null = null;
  editingPet: any = {
    id: 0,
    name: '',
    species: '',
    breed: '',
    age: 0,
    gender: 'M',
    color: '',
    weight: 0.1,
    description: ''
  };

  // New pet form - campos según tabla pets del backend
  newPet: any = {
    name: '',
    species: '',
    breed: '',
    age: 0,
    gender: 'M',
    color: '',
    weight: 0.1,
    description: ''
  };

  // Profile image handling
  selectedProfileImage: File | null = null;
  profileImagePreview: string | null = null;

  // Pet image handling
  selectedPetImage: File | null = null;
  petImagePreview: string | null = null;

  constructor(
    private router: Router, 
    private themeService: ThemeService,
    private authService: AuthService,
    private usersService: UsersService,
    private mascotasService: MascotasService,
    private publicacionesService: PublicacionesService
  ) {}

  ngOnInit(): void {
    this.darkMode = this.themeService.isDarkMode;
    this.themeService.darkMode$.subscribe(dark => this.darkMode = dark);

    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.loadUserProfile();
      this.cargarMascotasUsuario();
      this.cargarPublicacionesUsuario();
    } else if (this.authService.isLoggedIn()) {
      // Si hay token pero no hay usuario, recargar desde el backend
      this.authService.reloadUser().then(() => {
        this.loadUserProfile();
        this.cargarMascotasUsuario();
        this.cargarPublicacionesUsuario();
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadUserProfile(): void {
    const currentUser = this.authService.getCurrentUser();
    console.log('[PerfilUsuario] Usuario cargado desde auth:', currentUser);
    if (currentUser) {
      const avatar = currentUser.avatar || '';
      this.usuario = {
        id: currentUser.id,
        nombres: currentUser.firstName || '',
        apellidos: currentUser.lastName || '',
        correo: currentUser.email || '',
        telefono: currentUser.phone || '',
        edad: currentUser.age || 0,
        direccion: currentUser.address || '',
        tipoDocumento: currentUser.documentType || '',
        numDocumento: currentUser.documentNumber || '',
        imagen: avatar && avatar.startsWith('/uploads/') ? `http://localhost:3000${avatar}` : avatar,
        roleId: currentUser.roleId
      };
    }
  }


  cargarMascotasUsuario(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.id) {
      this.mascotasService.getMascotasByUsuario(currentUser.id).subscribe({
        next: (mascotas) => {
          this.mascotas = mascotas.map(m => ({
            ...m,
            foto: m.foto && m.foto.startsWith('/uploads/') ? `http://localhost:3000${m.foto}` : m.foto
          }));
          console.log('✅ Mascotas del usuario cargadas:', mascotas.length);
        },
        error: (err) => {
          console.error('❌ Error al cargar mascotas del usuario:', err);
        }
      });
    }
  }

  cargarPublicacionesUsuario(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.id) {
      this.publicacionesService.getPublicacionesPorAutor(currentUser.id).subscribe({
        next: (publicaciones) => {
          this.publicaciones = publicaciones.map(pub => ({
            ...pub,
            imagen: pub.imagen && pub.imagen.startsWith('/uploads/') ? `http://localhost:3000${pub.imagen}` : pub.imagen
          }));
          console.log('✅ Publicaciones del usuario cargadas:', publicaciones.length);
        },
        error: (err) => {
          console.error('❌ Error al cargar publicaciones del usuario:', err);
        }
      });
    }
  }

  eliminarPublicacion(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
      // Eliminar localmente inmediatamente
      this.publicaciones = this.publicaciones.filter(p => p.id !== id);

      this.publicacionesService.eliminarPublicacion(id).subscribe({
        next: () => {
          console.log('✅ Publicación eliminada exitosamente');
          this.cargarPublicacionesUsuario();
          alert('✅ Publicación eliminada exitosamente');
        },
        error: (err) => {
          console.error('❌ Error al eliminar publicación:', err);
          this.cargarPublicacionesUsuario();
          alert('❌ Error al eliminar la publicación: ' + (err.error?.message || 'Error desconocido'));
        }
      });
    }
  }

  // UI Methods
  cambiarSeccion(seccion: string): void {
    this.seccionActiva = seccion;
  }

  toggleSidebar(): void {
    this.sidebarAbierto = !this.sidebarAbierto;
  }

  cerrarSidebar(): void {
    this.sidebarAbierto = false;
  }

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }

  getRoleName(): string {
    const roleMap: { [key: number]: string } = {
      1: 'Administrador',
      2: 'Super Administrador',
      3: 'Veterinario',
      4: 'Usuario'
    };
    return roleMap[this.usuario.roleId || 4] || 'Usuario';
  }

  cerrarSesion(): void {
    this.themeService.setDarkMode(false);
    this.router.navigate(['/login']);
  }

  // Pet CRUD
  openAddPetModal(): void {
    this.newPet = {
      name: '',
      species: '',
      breed: '',
      age: 0,
      gender: 'M',
      color: '',
      weight: 0.1,
      description: ''
    };
    this.showAddPetModal = true;
  }

  closeAddPetModal(): void {
    this.showAddPetModal = false;
    this.newPetImagePreview = null;
  }

  guardarMascota(): void {
    if (!this.newPet.name || !this.newPet.species) {
      alert('Completa nombre y especie');
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      alert('No hay usuario autenticado');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.newPet.name);
    formData.append('species', this.newPet.species);
    formData.append('breed', this.newPet.breed || 'Mestizo');
    formData.append('age', String(this.newPet.age || 0));
    formData.append('gender', this.newPet.gender || 'M');
    formData.append('color', this.newPet.color || 'Desconocido');
    formData.append('weight', String(this.newPet.weight || 0.1));
    formData.append('description', this.newPet.description || '');
    formData.append('ownerId', String(currentUser.id));
    if (this.selectedPetFile) {
      formData.append('foto', this.selectedPetFile, this.selectedPetFile.name);
    }

    console.log('🔍 Datos enviados al backend:', formData);

    // Enviar al backend
    this.mascotasService.createMascota(formData).subscribe({
      next: (mascotaCreada) => {
        console.log('✅ Mascota creada exitosamente:', mascotaCreada);
        // Recargar las mascotas del usuario
        this.cargarMascotasUsuario();
        // Cerrar modal y limpiar formulario
        this.showAddPetModal = false;
        this.newPet = {
          name: '',
          species: '',
          breed: '',
          age: 0,
          gender: 'M',
          color: '',
          weight: 0.1,
          description: ''
        };
        this.selectedPetFile = null;
        this.newPetImagePreview = null;
        alert('✅ Mascota registrada exitosamente');
      },
      error: (err) => {
        console.error('❌ Error al crear mascota:', err);
        alert('❌ Error al registrar la mascota: ' + (err.error?.message || 'Error desconocido'));
      }
    });
  }

  openEditPetModal(mascota: any): void {
    this.editingPet = { ...mascota };
    this.editingPetImagePreview = mascota.foto || null;
    this.showEditPetModal = true;
  }

  closeEditPetModal(): void {
    this.showEditPetModal = false;
    this.editingPetImagePreview = null;
    this.selectedEditPetFile = null;
    this.editingPet = {
      id: 0,
      name: '',
      species: '',
      breed: '',
      age: 0,
      gender: 'M',
      color: '',
      weight: 0.1,
      description: ''
    };
  }

  guardarEdicionMascota(): void {
    if (!this.editingPet.id) return;

    // Validar peso
    const weight = Number(this.editingPet.weight);
    if (!weight || weight < 0.1 || weight > 200) {
      alert('❌ El peso debe estar entre 0.1 y 200 kg');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.editingPet.name);
    formData.append('species', this.editingPet.species);
    formData.append('breed', this.editingPet.breed || '');
    formData.append('age', String(this.editingPet.age));
    formData.append('gender', this.editingPet.gender);
    formData.append('color', this.editingPet.color);
    formData.append('weight', String(weight));
    formData.append('description', this.editingPet.description);
    if (this.selectedEditPetFile) {
      formData.append('foto', this.selectedEditPetFile, this.selectedEditPetFile.name);
    }

    this.mascotasService.updateMascota(this.editingPet.id, formData).subscribe({
      next: (mascotaActualizada) => {
        console.log('✅ Mascota actualizada exitosamente:', mascotaActualizada);
        this.cargarMascotasUsuario();
        alert('✅ Mascota actualizada exitosamente');
        this.closeEditPetModal();
      },
      error: (err) => {
        console.error('❌ Error al actualizar mascota:', err);
        alert('❌ Error al actualizar la mascota: ' + (err.error?.message || 'Error desconocido'));
        // NO cerrar el modal para que el usuario pueda corregir
      }
    });
  }

  eliminarMascota(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta mascota?')) {
      this.mascotas = this.mascotas.filter(m => m.id !== id);

      this.mascotasService.deleteMascota(id).subscribe({
        next: () => {
          console.log('✅ Mascota eliminada exitosamente');
          this.cargarMascotasUsuario();
          alert('✅ Mascota eliminada exitosamente');
        },
        error: (err) => {
          console.error('❌ Error al eliminar mascota:', err);
          this.cargarMascotasUsuario();
          alert('❌ Error al eliminar la mascota: ' + (err.error?.message || 'Error desconocido'));
        }
      });
    }
  }

  getGeneroTexto(genero: string): string {
    switch (genero) {
      case 'M': return 'Macho';
      case 'F': return 'Hembra';
      default: return 'Desconocido';
    }
  }

  selectedProfileFile: File | null = null;

  onProfileImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedProfileFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  selectedPetFile: File | null = null;
  selectedEditPetFile: File | null = null;

  // Métodos para manejar imagen de mascota
  onPetImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedPetFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newPetImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeNewPetImage(): void {
    this.newPetImagePreview = null;
    this.selectedPetFile = null;
  }

  onEditPetImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedEditPetFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.editingPetImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeEditPetImage(): void {
    this.editingPetImagePreview = null;
    this.selectedEditPetFile = null;
  }

  guardarPerfil(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      alert('❌ No hay usuario autenticado');
      return;
    }

    const formData = new FormData();
    formData.append('fullName', `${this.usuario.nombres} ${this.usuario.apellidos}`);
    formData.append('firstName', this.usuario.nombres);
    formData.append('lastName', this.usuario.apellidos);
    formData.append('email', this.usuario.correo);
    formData.append('phone', this.usuario.telefono || '');
    formData.append('age', String(this.usuario.edad || ''));
    formData.append('address', this.usuario.direccion || '');
    formData.append('documentType', this.usuario.tipoDocumento || '');
    formData.append('documentNumber', this.usuario.numDocumento || '');
    if (this.selectedProfileFile) {
      formData.append('avatar', this.selectedProfileFile, this.selectedProfileFile.name);
    }

    this.usersService.updateUser(currentUser.id, formData).subscribe({
      next: (response) => {
        this.authService.updateCurrentUser(response);
        this.selectedProfileFile = null;
        alert('✅ Perfil actualizado correctamente');
      },
      error: (error) => {
        alert('❌ Error al actualizar el perfil: ' + (error.error?.message || 'Error desconocido'));
        console.error('Update profile error:', error);
      }
    });
  }

  irAAdopciones(): void {
    this.router.navigate(['/adopcion']);
  }

  irATienda(): void {
    this.router.navigate(['/tienda']);
  }

  irAInicio(): void {
    this.router.navigate(['/inicio']);
  }

  eliminarCuenta(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && confirm('¿Estás seguro de que deseas desactivar tu cuenta? Esta acción te cerrará la sesión y no podrás ingresar hasta que sea reactivada.')) {
      this.usersService.deleteUser(currentUser.id).subscribe({
        next: () => {
          alert('Cuenta desactivada exitosamente.');
          this.cerrarSesion();
        },
        error: (error) => {
          alert('❌ Error al eliminar la cuenta: ' + (error.error?.message || 'Error desconocido'));
          console.error('Delete account error:', error);
        }
      });
    }
  }

  cambiarContrasena(): void {
    alert('Funcionalidad de cambio de contraseña próximamente disponible.');
  }
}
