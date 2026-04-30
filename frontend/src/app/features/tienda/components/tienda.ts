import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../core/services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tienda',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tienda.html',
  styleUrl: './tienda.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Tienda implements OnInit, OnDestroy {
  // Control de vistas: 'tiendas' | 'productos'
  vista: string = 'tiendas';

  // Modo oscuro
  modoOscuro: boolean = false;
  private themeSub!: Subscription;

  // Perfil
  profileMenuAbierto: boolean = false;
  currentUser: any = null;

  // Datos
  tiendas: any[] = [
    {
      id: 1,
      nombre: 'PetShop Central',
      direccion: 'Calle 123 #45-67, Duitama',
      telefono: '8 123 4567',
      horario: 'Lun-Sáb: 8:00 AM - 8:00 PM',
      estado: 'Activo'
    },
    {
      id: 2,
      nombre: 'Veterinaria Mascotas Felices',
      direccion: 'Av. Principal #89-10, Duitama',
      telefono: '8 234 5678',
      horario: 'Lun-Dom: 9:00 AM - 7:00 PM',
      estado: 'Activo'
    },
    {
      id: 3,
      nombre: 'Tienda Animal World',
      direccion: 'Carrera 15 #32-45, Duitama',
      telefono: '8 345 6789',
      horario: 'Lun-Sáb: 10:00 AM - 6:00 PM',
      estado: 'Activo'
    }
  ];
  tiendaSeleccionada: any = null;
  productos: any[] = [
    {
      id: 1,
      nombre: 'Alimento Premium para Perros',
      descripcion: 'Alimento balanceado de alta calidad para perros adultos',
      precio: 45000,
      categoria: 'food',
      imagen: 'assets/IMG/default.png'
    },
    {
      id: 2,
      nombre: 'Juguete Peluche Gato',
      descripcion: 'Peluche suave y resistente para gatos',
      precio: 15000,
      categoria: 'accessories',
      imagen: 'assets/IMG/default.png'
    },
    {
      id: 3,
      nombre: 'Vitaminas para Mascotas',
      descripcion: 'Suplemento vitamínico completo',
      precio: 28000,
      categoria: 'medicine',
      imagen: 'assets/IMG/default.png'
    },
    {
      id: 4,
      nombre: 'Correa Ajustable',
      descripcion: 'Correa resistente con ajuste de longitud',
      precio: 22000,
      categoria: 'accessories',
      imagen: 'assets/IMG/default.png'
    },
    {
      id: 5,
      nombre: 'Alimento Gato Adulto',
      descripcion: 'Nutrición completa para gatos adultos',
      precio: 38000,
      categoria: 'food',
      imagen: 'assets/IMG/default.png'
    }
  ];
  carrito: any[] = [];

  // Filtros
  filtroCategoria: string = 'all';
  filtroOrden: string = 'featured';

  // Carrusel
  slideActual: number = 0;

  // Carrito
  carritoVisible: boolean = false;

  constructor(private http: HttpClient, private themeService: ThemeService, private router: Router) {}

  // Intervalo para el carrusel
  private carouselInterval: any;

  ngOnInit(): void {
    this.cargarUsuario();
    // Comentado para usar datos de ejemplo
    // this.cargarTiendas();
    console.log('✅ Usando datos de ejemplo');

    // Sincronizar modo oscuro con ThemeService
    this.themeSub = this.themeService.darkMode$.subscribe(isDark => {
      this.modoOscuro = isDark;
    });
  }

  ngOnDestroy(): void {
    // Limpiar intervalo al destruir el componente
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
    if (this.themeSub) {
      this.themeSub.unsubscribe();
    }
  }

  // Cargar usuario actual
  private cargarUsuario(): void {
    const userData = localStorage.getItem('current_user');
    if (userData) {
      this.currentUser = JSON.parse(userData);
    }
  }

  // ===== FUNCIONES DE TIENDAS =====
  cargarTiendas(): void {
    this.http.get<any[]>('/usuarios/api/veterinarias').subscribe({
      next: (tiendas) => {
        this.tiendas = tiendas;
        console.log('✅ Tiendas cargadas:', tiendas);
      },
      error: (error) => {
        console.error('❌ Error al cargar tiendas:', error);
      }
    });
  }

  seleccionarTienda(tienda: any): void {
    this.tiendaSeleccionada = tienda;
    console.log(`🏪 Tienda seleccionada: ${tienda.nombre} (ID: ${tienda.id})`);

    // Comentado para usar datos de ejemplo
    // this.cargarProductosTienda(tienda.id);

    // Cambiar a vista de productos
    this.vista = 'productos';

    // Iniciar carrusel automático al entrar a productos
    this.iniciarCarrusel();

    // Scroll al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  volverATiendas(): void {
    this.vista = 'tiendas';
    this.tiendaSeleccionada = null;
    this.productos = [];

    // Detener carrusel al volver a tiendas
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    console.log('🔙 Volviendo a la selección de tiendas');
  }

  // ===== FUNCIONES DE PRODUCTOS =====
  cargarProductosTienda(tiendaId: number): void {
    console.log(`🔍 Cargando productos de tienda ID: ${tiendaId}`);

    this.http.get<any[]>(`/usuarios/api/veterinarias/${tiendaId}/productos`).subscribe({
      next: (productos) => {
        this.productos = productos;
        console.log(`✅ Productos cargados: ${productos.length}`);
      },
      error: (error) => {
        console.error('❌ Error al cargar productos:', error);
        this.productos = [];
      }
    });
  }

  // ===== FUNCIONES DE CARRITO =====
  agregarAlCarrito(producto: any): void {
    const existente = this.carrito.find(item => item.id === producto.id);

    if (existente) {
      existente.quantity++;
    } else {
      this.carrito.push({ ...producto, quantity: 1 });
    }

    console.log('🛒 Producto agregado:', producto);
  }

  eliminarDelCarrito(productId: number): void {
    this.carrito = this.carrito.filter(item => item.id !== productId);
  }

  actualizarCantidad(productId: number, cambio: number): void {
    const item = this.carrito.find(i => i.id === productId);
    if (item) {
      item.quantity += cambio;
      if (item.quantity <= 0) {
        this.eliminarDelCarrito(productId);
      }
    }
  }

  obtenerTotal(): number {
    return this.carrito.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
  }

  toggleCarrito(): void {
    this.carritoVisible = !this.carritoVisible;
  }

  // ===== CHECKOUT =====
  procederPago(): void {
    if (this.carrito.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }

    // Guardar en localStorage para la pasarela de pagos
    localStorage.setItem('checkoutCart', JSON.stringify(this.carrito));

    // Redirigir a pasarela de pagos
    this.router.navigate(['/pasarela-pagos']);
  }

  // ===== CARRUSEL =====
  iniciarCarrusel(): void {
    // Limpiar intervalo existente si hay uno
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }

    this.carouselInterval = setInterval(() => {
      this.siguienteSlide();
    }, 5000); // Cambiar slide cada 5 segundos
  }

  siguienteSlide(): void {
    this.slideActual = (this.slideActual + 1) % 3;
  }

  anteriorSlide(): void {
    this.slideActual = (this.slideActual - 1 + 3) % 3;
  }

  // ===== MODO OSCURO =====
  toggleModoOscuro(): void {
    this.themeService.toggleDarkMode();
  }

  irASlide(index: number): void {
    this.slideActual = index;
    // Reiniciar el auto-play al cambiar manualmente
    this.iniciarCarrusel();
  }

  // ===== FILTROS =====
  aplicarFiltros(): void {
    // Lógica de filtrado se implementaría aquí
    console.log('Filtros aplicados:', this.filtroCategoria, this.filtroOrden);
  }

  // ===== PERFIL =====
  logout(): void {
    localStorage.removeItem('current_user');
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }

  // Formatear precio
  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  }
}
