import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { Navbar } from './component/navbar/navbar';
import { Footer } from './component/footer/footer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  router = inject(Router);
  protected readonly title = signal('adso_3063267-angular');

  /** Rutas donde NO se muestra el navbar global */
  private readonly noNavbarRoutes = ['/', '/login', '/register', '/recovery', '/inicio', '/perfil-usuario'];

  /** Rutas donde NO se muestra el footer global */
  private readonly noFooterRoutes = ['/', '/login', '/register', '/recovery', '/perfil-usuario'];

  get showNavbar(): boolean {
    return !this.noNavbarRoutes.includes(this.router.url);
  }

  get showFooter(): boolean {
    return !this.noFooterRoutes.includes(this.router.url);
  }

  get showLayout(): boolean {
    return this.showNavbar;
  }
}