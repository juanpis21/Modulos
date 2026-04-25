import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkModeSubject.asObservable();

  constructor() {
    this.loadTheme();
  }

  get isDarkMode(): boolean {
    return this.darkModeSubject.value;
  }

  toggleDarkMode(): void {
    this.setDarkMode(!this.isDarkMode);
  }

  setDarkMode(dark: boolean): void {
    this.darkModeSubject.next(dark);
    this.applyTheme(dark);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    }
  }

  private loadTheme(): void {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('theme');
      const isDark = saved === 'dark';
      this.darkModeSubject.next(isDark);
      this.applyTheme(isDark);
    }
  }

  private applyTheme(dark: boolean): void {
    if (typeof document !== 'undefined') {
      // Apply both mechanisms so all components work
      document.body.classList.toggle('dark-mode', dark);
      document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    }
  }
}
