import { Component, OnInit, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';

interface MascotaAdopcion {
  id?: number;
  nombre: string;
  tipo: string;
  raza: string;
  edad: number;
  genero: string;
  tamano: string;
  descripcion: string;
  imagen: string;
  contacto: string;
  estado?: string;
  publicador?: string;
  fechaPublicacion?: string;
  estadoTexto?: string;
}

interface Estadisticas {
  adoptadas: number;
  esperando: number;
}

@Component({
  selector: 'app-adopcion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './adopcion.html',
  styleUrl: './adopcion.scss',
})
export class Adopcion implements OnInit {
  @HostBinding('attr.data-theme') theme = 'light';

  sidebarAbierto = false;
  darkMode = false;
  currentUser: any = null;

  // Alertas
  showAlert = false;
  alertMessage = '';
  alertType = 'success';

  // Modales
  showAdopcionModal = false;
  showDetallesModal = false;

  // Formulario de adopción
  nuevaMascota: MascotaAdopcion = {
    nombre: '',
    tipo: '',
    raza: '',
    edad: 0,
    genero: '',
    tamano: '',
    descripcion: '',
    imagen: '',
    contacto: ''
  };

  selectedFile: File | null = null;
  imagePreview: string | null = null;

  // Detalles de mascota
  mascotaDetalles: MascotaAdopcion | null = null;

  // Listas de mascotas (datos de ejemplo)
  misMascotas: MascotaAdopcion[] = [];
  mascotasDisponibles: MascotaAdopcion[] = [];

  // Estadísticas
  estadisticas: Estadisticas = {
    adoptadas: 127,
    esperando: 45
  };

  // Filtros
  filtroTipo = 'todos';
  filtroTamano = 'todos';

  // Dropdown
  dropdownAbierto: number | null = null;

  constructor(
    private router: Router,
    private themeService: ThemeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.darkMode = this.themeService.isDarkMode;
    this.theme = this.darkMode ? 'dark' : 'light';
    this.applyThemeToBody(this.darkMode);
    this.themeService.darkMode$.subscribe(dark => {
      this.darkMode = dark;
      this.theme = dark ? 'dark' : 'light';
      this.applyThemeToBody(dark);
    });
    this.currentUser = this.authService.getCurrentUser();
    this.cargarMascotas();
  }

  private applyThemeToBody(dark: boolean): void {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
      document.body.setAttribute('data-theme', dark ? 'dark' : 'light');
    }
  }

  cargarMascotas(): void {
    // Cargar mascotas de ejemplo (aquí se conectaría con el backend)
    this.misMascotas = [];
    this.mascotasDisponibles = [
      {
        id: 1,
        nombre: 'Max',
        tipo: 'Perro',
        raza: 'Golden Retriever',
        edad: 3,
        genero: 'Macho',
        tamano: 'Grande',
        descripcion: 'Amigable y juguetón, le encanta correr y jugar con niños.',
        imagen: 'assets/IMG/Desparasitacion1.png',
        contacto: '3201234567',
        estado: 'DISPONIBLE',
        publicador: 'Juan Pérez',
        fechaPublicacion: '2024-01-15'
      }
    ];
  }

  toggleSidebar(): void {
    this.sidebarAbierto = !this.sidebarAbierto;
  }

  cerrarSidebar(): void {
    this.sidebarAbierto = false;
  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
    this.theme = this.darkMode ? 'dark' : 'light';
    this.themeService.setDarkMode(this.darkMode);
    this.applyThemeToBody(this.darkMode);
  }

  irAInicio(): void {
    this.router.navigate(['/inicio']);
  }

  irAPerfil(): void {
    this.router.navigate(['/perfil-usuario']);
  }

  cerrarSesion(): void {
    this.themeService.setDarkMode(false);
    this.router.navigate(['/login']);
  }

  mostrarAlerta(mensaje: string, tipo: 'success' | 'danger' | 'warning'): void {
    this.alertMessage = mensaje;
    this.alertType = tipo;
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
    }, 5000);
  }

  cerrarAlerta(): void {
    this.showAlert = false;
  }

  // Modal de adopción
  abrirModalAdopcion(): void {
    this.showAdopcionModal = true;
  }

  cerrarModalAdopcion(): void {
    this.showAdopcionModal = false;
    this.resetFormulario();
  }

  resetFormulario(): void {
    this.nuevaMascota = {
      nombre: '',
      tipo: '',
      raza: '',
      edad: 0,
      genero: '',
      tamano: '',
      descripcion: '',
      imagen: '',
      contacto: ''
    };
    this.selectedFile = null;
    this.imagePreview = null;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
        this.nuevaMascota.imagen = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  publicarMascota(): void {
    if (!this.nuevaMascota.nombre || !this.nuevaMascota.tipo || 
        !this.nuevaMascota.edad || !this.nuevaMascota.tamano || 
        !this.nuevaMascota.descripcion || !this.nuevaMascota.contacto) {
      this.mostrarAlerta('Por favor completa todos los campos obligatorios', 'danger');
      return;
    }

    // Aquí se enviaría al backend
    const mascotaGuardada: MascotaAdopcion = {
      ...this.nuevaMascota,
      id: Date.now(),
      estado: 'DISPONIBLE',
      publicador: this.currentUser?.fullName || 'Usuario',
      fechaPublicacion: new Date().toISOString().split('T')[0]
    };

    this.misMascotas.push(mascotaGuardada);
    this.mostrarAlerta('✅ Mascota publicada correctamente', 'success');
    this.cerrarModalAdopcion();
  }

  // Modal de detalles
  verDetalles(mascota: MascotaAdopcion): void {
    this.mascotaDetalles = {
      ...mascota,
      estadoTexto: this.getEstadoTexto(mascota.estado || '')
    };
    this.showDetallesModal = true;
  }

  cerrarModalDetalles(): void {
    this.showDetallesModal = false;
    this.mascotaDetalles = null;
  }

  cambiarEstado(mascota: MascotaAdopcion, nuevoEstado: string): void {
    if (mascota.id) {
      const index = this.misMascotas.findIndex(m => m.id === mascota.id);
      if (index >= 0) {
        this.misMascotas[index].estado = nuevoEstado;
        this.mostrarAlerta('Estado actualizado correctamente', 'success');
      }
    }
  }

  eliminarMascota(mascota: MascotaAdopcion): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta mascota?')) {
      this.misMascotas = this.misMascotas.filter(m => m.id !== mascota.id);
      this.mostrarAlerta('Mascota eliminada correctamente', 'success');
    }
  }

  filtrarMascotas(): void {
    // Lógica de filtrado (aquí se conectaría con backend)
    console.log('Filtrando por:', this.filtroTipo, this.filtroTamano);
  }

  limpiarFiltros(): void {
    this.filtroTipo = 'todos';
    this.filtroTamano = 'todos';
  }

  toggleDropdown(id: number): void {
    if (this.dropdownAbierto === id) {
      this.dropdownAbierto = null;
    } else {
      this.dropdownAbierto = id;
    }
  }

  getEstadoTexto(estado: string): string {
    switch (estado) {
      case 'DISPONIBLE': return 'En espera';
      case 'EN_PROCESO': return 'En Proceso';
      case 'ADOPTADO': return 'Adoptado';
      default: return estado;
    }
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'DISPONIBLE': return 'bg-success';
      case 'EN_PROCESO': return 'bg-warning';
      case 'ADOPTADO': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
