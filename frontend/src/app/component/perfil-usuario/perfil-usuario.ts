import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';

interface Mascota {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  edad: number;
  unidadEdad: string;
  genero: string;
  tamano: string;
  descripcion: string;
  foto: string;
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

  mascotas: Mascota[] = [
    {
      id: 1,
      nombre: 'Max',
      especie: 'Perro',
      raza: 'Golden Retriever',
      edad: 3,
      unidadEdad: 'años',
      genero: 'M',
      tamano: 'grande',
      descripcion: 'Amigable y juguetón, le encanta correr.',
      foto: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=200&fit=crop'
    },
    {
      id: 2,
      nombre: 'Luna',
      especie: 'Gato',
      raza: 'Siamés',
      edad: 2,
      unidadEdad: 'años',
      genero: 'F',
      tamano: 'pequeño',
      descripcion: 'Tranquila y cariñosa.',
      foto: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&h=200&fit=crop'
    },
    {
      id: 3,
      nombre: 'Rocky',
      especie: 'Perro',
      raza: 'Bulldog Francés',
      edad: 1,
      unidadEdad: 'años',
      genero: 'M',
      tamano: 'pequeño',
      descripcion: 'Travieso y muy activo.',
      foto: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=300&h=200&fit=crop'
    }
  ];

  // Modal state
  showAddPetModal = false;
  showEditPetModal = false;
  editingPet: Mascota = {
    id: 0,
    nombre: '',
    especie: '',
    raza: '',
    edad: 0,
    unidadEdad: 'años',
    genero: 'M',
    tamano: '',
    descripcion: '',
    foto: ''
  };

  // New pet form
  newPet: Partial<Mascota> = {
    nombre: '', especie: '', raza: '', edad: 0,
    unidadEdad: 'años', genero: 'M', tamano: '', descripcion: ''
  };

  // Profile image handling
  selectedProfileImage: File | null = null;
  profileImagePreview: string | null = null;

  constructor(
    private router: Router, 
    private themeService: ThemeService,
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.darkMode = this.themeService.isDarkMode;
    this.themeService.darkMode$.subscribe(dark => this.darkMode = dark);
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    const currentUser = this.authService.getCurrentUser();
    console.log('[PerfilUsuario] Usuario cargado desde auth:', currentUser);
    if (currentUser) {
      this.usuario = {
        id: currentUser.id,
        nombres: currentUser.firstName || '',
        apellidos: currentUser.lastName || '',
        correo: currentUser.email,
        telefono: currentUser.phone || '',
        edad: currentUser.age || null,
        direccion: currentUser.address || '',
        tipoDocumento: currentUser.documentType || '',
        numDocumento: currentUser.documentNumber || '',
        imagen: currentUser.avatar || 'assets/images/Default.png',
        roleId: currentUser.roleId || currentUser.role?.id || undefined
      };
    }
  }

  getRoleName(): string {
    if (!this.usuario.roleId) return 'Usuario';
    // Mapa de roles basado en IDs (ajústalo según tus roles reales)
    const roles: Record<number, string> = {
      1: 'Superadmin',
      2: 'Admin',
      3: 'Veterinario',
      4: 'Usuario'
    };
    return roles[this.usuario.roleId] || 'Usuario';
  }

  cambiarSeccion(seccion: string): void {
    this.seccionActiva = seccion;
    this.cerrarSidebar();
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

  irAInicio(): void {
    this.router.navigate(['/inicio']);
  }

  cerrarSesion(): void {
    this.themeService.setDarkMode(false);
    this.router.navigate(['/login']);
  }

  // Pet CRUD
  openAddPetModal(): void {
    this.newPet = {
      nombre: '', especie: '', raza: '', edad: 0,
      unidadEdad: 'años', genero: 'M', tamano: '', descripcion: ''
    };
    this.showAddPetModal = true;
  }

  closeAddPetModal(): void {
    this.showAddPetModal = false;
  }

  guardarMascota(): void {
    if (!this.newPet.nombre || !this.newPet.especie) return;
    const newId = Math.max(...this.mascotas.map(m => m.id), 0) + 1;
    this.mascotas.push({
      id: newId,
      nombre: this.newPet.nombre!,
      especie: this.newPet.especie!,
      raza: this.newPet.raza || 'Mestizo',
      edad: this.newPet.edad || 0,
      unidadEdad: this.newPet.unidadEdad || 'años',
      genero: this.newPet.genero || 'M',
      tamano: this.newPet.tamano || 'mediano',
      descripcion: this.newPet.descripcion || '',
      foto: ''
    });
    this.showAddPetModal = false;
  }

  openEditPetModal(mascota: Mascota): void {
    this.editingPet = { ...mascota };
    this.showEditPetModal = true;
  }

  closeEditPetModal(): void {
    this.showEditPetModal = false;
    this.editingPet = {
      id: 0,
      nombre: '',
      especie: '',
      raza: '',
      edad: 0,
      unidadEdad: 'años',
      genero: 'M',
      tamano: '',
      descripcion: '',
      foto: ''
    };
  }

  guardarEdicionMascota(): void {
    if (!this.editingPet.id) return;
    const idx = this.mascotas.findIndex(m => m.id === this.editingPet.id!);
    if (idx >= 0 && this.editingPet) {
      this.mascotas[idx] = { ...this.editingPet } as Mascota;
    }
    this.closeEditPetModal();
  }

  eliminarMascota(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta mascota?')) {
      this.mascotas = this.mascotas.filter(m => m.id !== id);
    }
  }

  getEdadTexto(mascota: Mascota): string {
    if (mascota.unidadEdad === 'meses') {
      return mascota.edad === 1 ? '1 mes' : `${mascota.edad} meses`;
    }
    return mascota.edad === 1 ? '1 año' : `${mascota.edad} años`;
  }

  getGeneroTexto(genero: string): string {
    switch (genero) {
      case 'M': return 'Macho';
      case 'F': return 'Hembra';
      default: return 'Desconocido';
    }
  }

  onProfileImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          this.resizeImage(img, 400, 400).then(resizedBase64 => {
            this.profileImagePreview = resizedBase64;
            this.usuario.imagen = resizedBase64;
          });
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  resizeImage(img: HTMLImageElement, maxWidth: number, maxHeight: number): Promise<string> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    });
  }

  guardarPerfil(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      alert('❌ No hay usuario autenticado');
      return;
    }

    const updateUserDto = {
      fullName: `${this.usuario.nombres} ${this.usuario.apellidos}`,
      firstName: this.usuario.nombres,
      lastName: this.usuario.apellidos,
      email: this.usuario.correo,
      phone: this.usuario.telefono,
      age: this.usuario.edad,
      address: this.usuario.direccion,
      documentType: this.usuario.tipoDocumento,
      documentNumber: this.usuario.numDocumento,
      avatar: this.usuario.imagen
    };

    this.usersService.updateUser(currentUser.id, updateUserDto).subscribe({
      next: (response) => {
        // Actualizar estado global y localStorage con los datos reales del servidor
        this.authService.updateCurrentUser(response);
        localStorage.setItem('user_avatar', this.usuario.imagen);
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
}
