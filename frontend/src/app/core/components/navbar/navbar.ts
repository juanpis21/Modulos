import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar implements OnInit {
  isMenuOpen = false;
  isDarkMode = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.isDarkMode = this.themeService.isDarkMode;
    this.themeService.darkMode$.subscribe(dark => this.isDarkMode = dark);
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleTheme(event: any) {
    this.themeService.toggleDarkMode();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    this.isMenuOpen = false;
  }
}
