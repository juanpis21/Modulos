import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-perfil-veterinario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil-veterinario.html',
  styleUrl: './perfil-veterinario.scss',
})
export class PerfilVeterinario implements OnInit, OnDestroy {
  currentUser: any = null;
  activeSection: string = 'inicio';
  isSidebarOpen: boolean = false;
  isDarkMode: boolean = false;
  
  // Datos del dashboard
  dashboardStats = {
    eventos: 0,
    productos: 0,
    citasHoy: 0,
    mascotasAtendidas: 0
  };

  // Lista de eventos
  eventos: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.initializeComponent();
    this.loadUserData();
    this.loadDashboardData();
    this.setupEventListeners();
    this.checkDarkMode();
  }

  ngOnDestroy() {
    this.cleanupEventListeners();
  }

  // Inicialización del componente
  private initializeComponent(): void {
    // Establecer sección inicial
    this.setActiveSection('inicio');
    
    // Configurar sidebar
    this.updateSidebarState();
  }

  // Cargar datos del usuario
  private loadUserData(): void {
    // Primero intentar obtener del AuthService
    this.currentUser = this.authService.getCurrentUser();
    
    if (this.currentUser) {
      console.log('✅ Veterinario logueado (desde AuthService):', this.currentUser);
    } else {
      // Si no hay datos en AuthService, intentar del localStorage directamente
      const userData = localStorage.getItem('current_user');
      if (userData) {
        this.currentUser = JSON.parse(userData);
        console.log('✅ Veterinario logueado (desde localStorage):', this.currentUser);
      } else {
        console.error('❌ No se encontraron datos del usuario');
        this.router.navigate(['/login']);
        return;
      }
    }
    
    // Verificar que sea un veterinario
    if (this.currentUser.roleId !== 3) {
      console.error('❌ Acceso denegado: El usuario no es veterinario');
      this.router.navigate(['/login']);
    }
  }

  // Cargar datos del dashboard
  private loadDashboardData(): void {
    // Simular carga de datos - en producción vendría del backend
    setTimeout(() => {
      this.dashboardStats = {
        eventos: 5,
        productos: 12,
        citasHoy: 8,
        mascotasAtendidas: 156
      };
      this.updateDashboardUI();
    }, 1000);
  }

  // Actualizar UI del dashboard
  private updateDashboardUI(): void {
    const eventCard = document.querySelector('.card-summary.bg-warning h3');
    const productCard = document.querySelector('.card-summary.bg-info h3');
    
    if (eventCard) eventCard.textContent = this.dashboardStats.eventos.toString();
    if (productCard) productCard.textContent = this.dashboardStats.productos.toString();
  }

  // Configurar event listeners
  private setupEventListeners(): void {
    // Toggle sidebar
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    if (hamburgerBtn) {
      hamburgerBtn.addEventListener('click', () => this.toggleSidebar());
    }
    
    if (sidebarOverlay) {
      sidebarOverlay.addEventListener('click', () => this.closeSidebar());
    }

    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('change', (e: any) => this.toggleTheme(e.target.checked));
    }

    // Navigation
    this.setupNavigation();
  }

  // Configurar navegación
  private setupNavigation(): void {
    const navLinks = document.querySelectorAll('[data-section]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e: any) => {
        e.preventDefault();
        const section = e.target.getAttribute('data-section');
        this.setActiveSection(section);
      });
    });
  }

  // Cambiar sección activa
  setActiveSection(section: string): void {
    this.activeSection = section;
    
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(s => s.classList.remove('active'));
    
    // Mostrar sección activa
    const activeSectionElement = document.getElementById(section);
    if (activeSectionElement) {
      activeSectionElement.classList.add('active');
    }
    
    // Actualizar navegación
    this.updateNavigation(section);
  }

  // Actualizar navegación activa
  private updateNavigation(activeSection: string): void {
    const navLinks = document.querySelectorAll('[data-section]');
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === activeSection) {
        link.classList.add('active');
      }
    });
  }

  // Toggle sidebar
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.updateSidebarState();
  }

  // Cerrar sidebar
  closeSidebar(): void {
    this.isSidebarOpen = false;
    this.updateSidebarState();
  }

  // Actualizar estado del sidebar
  private updateSidebarState(): void {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar) {
      if (this.isSidebarOpen) {
        sidebar.classList.add('open');
        overlay?.classList.add('active');
      } else {
        sidebar.classList.remove('open');
        overlay?.classList.remove('active');
      }
    }
  }

  // Toggle theme
  toggleTheme(isDark: boolean): void {
    this.isDarkMode = isDark;
    document.body.classList.toggle('dark-mode', isDark);
    localStorage.setItem('darkMode', isDark.toString());
  }

  // Verificar modo oscuro
  private checkDarkMode(): void {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
      this.isDarkMode = true;
      document.body.classList.add('dark-mode');
      const themeToggle = document.getElementById('themeToggle') as HTMLInputElement;
      if (themeToggle) themeToggle.checked = true;
    }
  }

  // Cerrar sesión
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Abrir modal
  openModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('modal-overlay');
    
    if (modal && overlay) {
      modal.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  // Cerrar modal
  closeModal(): void {
    const modals = document.querySelectorAll('.modal.active');
    const overlay = document.getElementById('modal-overlay');
    
    modals.forEach(modal => modal.classList.remove('active'));
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Limpiar event listeners
  private cleanupEventListeners(): void {
    // Limpiar listeners para evitar memory leaks
    document.removeEventListener('click', this.handleGlobalClick);
  }

  // Manejar clicks globales
  private handleGlobalClick = (e: Event): void => {
    // Lógica para clicks fuera de modales, etc.
  };

  // Métodos para eventos
  createEvent(): void {
    console.log('Crear nuevo evento');
    this.openModal('new-event-modal');
  }

  editEvent(eventId: number): void {
    console.log('Editar evento:', eventId);
    this.openModal('edit-event-modal');
  }

  deleteEvent(eventId: number): void {
    if (confirm('¿Estás seguro de eliminar este evento?')) {
      console.log('Eliminar evento:', eventId);
      // Lógica para eliminar evento
    }
  }

  // Métodos para productos
  createProduct(): void {
    console.log('Crear nuevo producto');
    this.openModal('new-product-modal');
  }

  editProduct(productId: number): void {
    console.log('Editar producto:', productId);
  }

  deleteProduct(productId: number): void {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      console.log('Eliminar producto:', productId);
    }
  }

  // Métodos para citas
  createAppointment(): void {
    console.log('Crear nueva cita');
    this.openModal('new-appointment-modal');
  }

  // Métodos de utilidad
  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatTime(time: string): string {
    return time.slice(0, 5); // HH:MM
  }

  // Obtener iniciales del nombre
  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  // Obtener saludo según hora
  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  }
}
