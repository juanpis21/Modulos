import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';
import { PublicacionesService } from '../services/publicaciones.service';

interface Publicacion {
  id: number;
  autorId?: number;
  usuario: {
    nombre: string;
    avatar: string;
  };
  contenido: string;
  imagen?: string;
  fecha: Date;
  likes: number;
  comentarios: Comentario[];
  compartidos: number;
  likedByUser: boolean;
  mostrarComentarios: boolean;
  // Animation states
  likeAnimating?: boolean;
  shareAnimating?: boolean;
  justPublished?: boolean;
}

interface Comentario {
  id: number;
  usuario: {
    nombre: string;
    avatar: string;
  };
  contenido: string;
  fecha: Date;
  justAdded?: boolean;
}

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.scss']
})
export class Inicio implements OnInit {
  usuarioLogueado: any = null;
  publicaciones: Publicacion[] = [];
  nuevaPublicacion: string = '';
  imagenSeleccionada: File | null = null;
  imagenPreview: string | null = null;
  menuAbierto: boolean = false;
  profileMenuAbierto: boolean = false;
  modoOscuro: boolean = false;
  showScrollTop: boolean = false;
  nuevoComentario: { [key: number]: string } = {};
  currentPlaceholder: string = '';

  private placeholders = [
    '¿Qué travesura hizo hoy tu mascota? 😏',
    'Comparte algo adorable 🐾',
    '¿Tu mascota hizo algo gracioso? ¡Cuéntanos! 😂',
    '¿Cómo está tu peludo hoy? 🐶',
    'Sube una foto de tu mascota 📸✨',
    '¿Qué aventura vivió tu mascota hoy? 🌟',
    'Comparte un consejo para mascotas 💡🐱',
    '¿Tu mascota te robó el corazón hoy? ❤️🐕'
  ];

  constructor(
    private router: Router,
    private themeService: ThemeService,
    private authService: AuthService,
    private publicacionesService: PublicacionesService
  ) {}

  getRandomPlaceholder(): string {
    return this.placeholders[Math.floor(Math.random() * this.placeholders.length)];
  }

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.usuarioLogueado = {
        nombre: user.fullName || user.username || 'Usuario',
        email: user.email,
        avatar: user.avatar || 'assets/images/Default.png'
      };
    } else if (this.authService.isLoggedIn()) {
      // Si hay token pero no hay usuario, recargar desde el backend
      this.authService.reloadUser().then(() => {
        const reloadedUser = this.authService.currentUser();
        if (reloadedUser) {
          this.usuarioLogueado = {
            nombre: reloadedUser.fullName || reloadedUser.username || 'Usuario',
            email: reloadedUser.email,
            avatar: reloadedUser.avatar || 'assets/images/Default.png'
          };
        }
      });
    } else {
      this.usuarioLogueado = null;
    }
    this.currentPlaceholder = this.getRandomPlaceholder();
    this.cargarPublicaciones();
    this.modoOscuro = this.themeService.isDarkMode;
    this.themeService.darkMode$.subscribe(dark => this.modoOscuro = dark);
  }

  cargarPublicaciones(): void {
    this.publicacionesService.getPublicaciones().subscribe({
      next: (publicacionesBackend) => {
        // Mapear las publicaciones del backend al formato del frontend
        this.publicaciones = publicacionesBackend.map(pub => ({
          id: pub.id,
          autorId: pub.autorId,
          usuario: {
            nombre: pub.autor?.fullName || pub.autor?.username || 'Usuario',
            avatar: pub.autor?.avatar || 'assets/images/Default.png'
          },
          contenido: pub.descripcion,
          imagen: pub.imagen && pub.imagen.startsWith('/uploads/') ? `http://localhost:3000${pub.imagen}` : pub.imagen,
          fecha: new Date(pub.createdAt),
          likes: pub.likes || 0,
          comentarios: [],
          compartidos: 0,
          likedByUser: false,
          mostrarComentarios: false
        }));
      },
      error: (err) => {
        console.error('Error al cargar publicaciones:', err);
        // Cargar publicaciones de ejemplo si falla
        this.cargarPublicacionesDeEjemplo();
      }
    });
  }

  cargarPublicacionesDeEjemplo(): void {
    // Publicaciones de ejemplo
    this.publicaciones = [
      {
        id: 1,
        usuario: {
          nombre: 'María García',
          avatar: 'https://ui-avatars.com/api/?name=Maria+Garcia&background=4ade80&color=fff'
        },
        contenido: '¡Mi perro Max disfrutando del parque hoy! 🐶 🌳',
        imagen: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600',
        fecha: new Date(Date.now() - 2 * 60 * 60 * 1000),
        likes: 24,
        comentarios: [
          {
            id: 1,
            usuario: {
              nombre: 'Carlos Pérez',
              avatar: 'https://ui-avatars.com/api/?name=Carlos+Perez&background=3b82f6&color=fff'
            },
            contenido: '¡Qué lindo! 😍',
            fecha: new Date(Date.now() - 1 * 60 * 60 * 1000)
          }
        ],
        compartidos: 3,
        likedByUser: false,
        mostrarComentarios: false
      },
      {
        id: 2,
        usuario: {
          nombre: 'Juan Martínez',
          avatar: 'https://ui-avatars.com/api/?name=Juan+Martinez&background=f59e0b&color=fff'
        },
        contenido: 'Recordatorio: Vacunación gratuita este sábado en la Clínica Veterinaria Central 💉',
        fecha: new Date(Date.now() - 5 * 60 * 60 * 1000),
        likes: 45,
        comentarios: [],
        compartidos: 12,
        likedByUser: true,
        mostrarComentarios: false
      },
      {
        id: 3,
        usuario: {
          nombre: 'Ana Rodríguez',
          avatar: 'https://ui-avatars.com/api/?name=Ana+Rodriguez&background=ec4899&color=fff'
        },
        contenido: 'Tips para el cuidado dental de tu gato: 1) Cepillar los dientes al menos 2 veces por semana 2) Usar pasta dental especial para gatos 3) Visitar al veterinario cada 6 meses 🐱✨',
        fecha: new Date(Date.now() - 8 * 60 * 60 * 1000),
        likes: 67,
        comentarios: [
          {
            id: 1,
            usuario: {
              nombre: 'Laura Sánchez',
              avatar: 'https://ui-avatars.com/api/?name=Laura+Sanchez&background=8b5cf6&color=fff'
            },
            contenido: '¡Muy útil! Mi gato odia el cepillo pero voy a intentarlo 😅',
            fecha: new Date(Date.now() - 7 * 60 * 60 * 1000)
          },
          {
            id: 2,
            usuario: {
              nombre: 'Pedro López',
              avatar: 'https://ui-avatars.com/api/?name=Pedro+Lopez&background=06b6d4&color=fff'
            },
            contenido: 'Gracias por los consejos Ana! 👏',
            fecha: new Date(Date.now() - 6 * 60 * 60 * 1000)
          }
        ],
        compartidos: 23,
        likedByUser: false,
        mostrarComentarios: false
      }
    ];
  }

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  toggleProfileMenu(): void {
    this.profileMenuAbierto = !this.profileMenuAbierto;
  }

  toggleModoOscuro(): void {
    this.themeService.toggleDarkMode();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imagenSeleccionada = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  eliminarImagen(): void {
    this.imagenSeleccionada = null;
    this.imagenPreview = null;
  }

  publicar(): void {
    if (this.nuevaPublicacion.trim() || this.imagenSeleccionada) {
      const user = this.authService.getCurrentUser();
      const formData = new FormData();
      formData.append('descripcion', this.nuevaPublicacion);
      formData.append('autorId', String(user?.userId || user?.id || ''));
      if (this.imagenSeleccionada) {
        formData.append('imagen', this.imagenSeleccionada, this.imagenSeleccionada.name);
      }

      this.publicacionesService.crearPublicacion(formData).subscribe({
        next: (publicacionCreada) => {
          const nuevaPublicacion: Publicacion = {
            id: publicacionCreada.id,
            autorId: publicacionCreada.autorId,
            usuario: {
              nombre: this.usuarioLogueado?.nombre || 'Usuario',
              avatar: this.usuarioLogueado?.avatar || 'assets/images/Default.png'
            },
            contenido: publicacionCreada.descripcion,
            imagen: publicacionCreada.imagen ? `http://localhost:3000${publicacionCreada.imagen}` : undefined,
            fecha: new Date(publicacionCreada.createdAt),
            likes: 0,
            comentarios: [],
            compartidos: 0,
            likedByUser: false,
            mostrarComentarios: false,
            justPublished: true
          };
          this.publicaciones.unshift(nuevaPublicacion);
          this.nuevaPublicacion = '';
          this.currentPlaceholder = this.getRandomPlaceholder();
          this.eliminarImagen();

          // Remove animation class after animation ends
          setTimeout(() => {
            nuevaPublicacion.justPublished = false;
          }, 800);
        },
        error: (err) => {
          console.error('Error al crear publicación:', err);
          alert('Error al crear la publicación. Por favor intenta nuevamente.');
        }
      });
    }
  }

  darLike(publicacion: Publicacion): void {
    publicacion.likeAnimating = true;
    if (publicacion.likedByUser) {
      publicacion.likes--;
    } else {
      publicacion.likes++;
    }
    publicacion.likedByUser = !publicacion.likedByUser;

    // Remove animation class after animation ends
    setTimeout(() => {
      publicacion.likeAnimating = false;
    }, 600);
  }

  toggleComentarios(publicacion: Publicacion): void {
    publicacion.mostrarComentarios = !publicacion.mostrarComentarios;
  }

  agregarComentario(publicacion: Publicacion): void {
    const contenido = this.nuevoComentario[publicacion.id];
    if (contenido && contenido.trim()) {
      const nuevoComentario: Comentario = {
        id: publicacion.comentarios.length + 1,
        usuario: {
          nombre: this.usuarioLogueado?.nombre || 'Usuario',
          avatar: this.usuarioLogueado?.avatar || 'assets/images/Default.png'
        },
        contenido: contenido,
        fecha: new Date(),
        justAdded: true
      };
      publicacion.comentarios.push(nuevoComentario);
      this.nuevoComentario[publicacion.id] = '';

      // Remove animation class after animation ends
      setTimeout(() => {
        nuevoComentario.justAdded = false;
      }, 600);
    }
  }

  compartir(publicacion: Publicacion): void {
    publicacion.shareAnimating = true;
    publicacion.compartidos++;

    setTimeout(() => {
      publicacion.shareAnimating = false;
    }, 800);
  }

  getTiempoTranscurrido(fecha: Date): string {
    const ahora = new Date();
    const diff = ahora.getTime() - new Date(fecha).getTime();
    const minutos = Math.floor(diff / 60000);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (dias > 0) return `Hace ${dias} día${dias > 1 ? 's' : ''}`;
    if (horas > 0) return `Hace ${horas} hora${horas > 1 ? 's' : ''}`;
    if (minutos > 0) return `Hace ${minutos} minuto${minutos > 1 ? 's' : ''}`;
    return 'Ahora';
  }

  getUser(): any {
    // Obtener usuario real del localStorage a través del AuthService
    const user = this.authService.getCurrentUser();
    if (user) {
      return {
        nombre: user.fullName || user.username || 'Usuario',
        email: user.email,
        avatar: user.avatar || 'assets/images/Default.png'
      };
    }
    return {
      nombre: 'Usuario',
      email: '',
      avatar: 'assets/images/Default.png'
    };
  }

  logout(): void {
    this.menuAbierto = false;
    this.usuarioLogueado = null;
    this.themeService.setDarkMode(false);
    this.router.navigate(['/login']);
  }

  irAPerfil(): void {
    this.menuAbierto = false;
    this.router.navigate(['/perfil-usuario']);
  }

  irATienda(): void {
    this.menuAbierto = false;
    this.router.navigate(['/tienda']);
  }

  irAAdopciones(): void {
    this.menuAbierto = false;
    this.router.navigate(['/adopcion']);
  }

  irASobreNosotros(): void {
    this.menuAbierto = false;
    this.router.navigate(['/sobre-nosotros']);
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.showScrollTop = window.scrollY > 300;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
