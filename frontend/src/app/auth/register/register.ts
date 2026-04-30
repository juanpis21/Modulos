import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../core/services/users.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  isTermsModalOpen = false;
  isSubmitting = false;
  errorMessage = '';

  formData = {
    nombres: '',
    apellidos: '',
    tipoDocumento: '',
    numDocumento: '',
    celular: '',
    direccion: '',
    edad: null,
    correo: '',
    password: '',
    confirmPassword: '',
    acepto: false
  };

  showPassword = false;
  showConfirmPassword = false;
  placeholderDoc = 'Número de documento';
  patternDoc = '';

  constructor(
    private router: Router,
    private usersService: UsersService
  ) {}

  openTermsModal(event: Event): void {
    event.preventDefault();
    this.isTermsModalOpen = true;
  }

  closeTermsModal(): void {
    this.isTermsModalOpen = false;
  }

  onDocumentTypeChange(): void {
    switch (this.formData.tipoDocumento) {
      case 'Cédula':
        this.placeholderDoc = 'Ej: 12345678';
        this.patternDoc = '[0-9]{6,12}';
        break;
      case 'DNI':
        this.placeholderDoc = 'Ej: 12345678';
        this.patternDoc = '[0-9]{7,9}';
        break;
      case 'Pasaporte':
        this.placeholderDoc = 'Ej: AB123456';
        this.patternDoc = '[A-Z0-9]{6,12}';
        break;
      default:
        this.placeholderDoc = 'Número de documento';
        this.patternDoc = '';
    }
  }

  togglePasswordVisibility(field: 'password' | 'confirm'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  socialLogin(provider: string, event: Event): void {
    event.preventDefault();
    alert(`🔄 Funcionalidad de ${provider} en desarrollo`);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.errorMessage = '';

    // Validaciones
    if (!this.formData.nombres || !this.formData.apellidos || !this.formData.correo ||
        !this.formData.password || !this.formData.confirmPassword) {
      this.errorMessage = 'Por favor, completa todos los campos obligatorios';
      return;
    }

    if (this.formData.password !== this.formData.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    if (this.formData.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    if (!this.formData.acepto) {
      this.errorMessage = 'Debes aceptar los términos y condiciones';
      return;
    }

    this.isSubmitting = true;

    // Mapear datos del formulario al DTO del backend
    const userDto = {
      username: this.formData.correo.split('@')[0] + Math.floor(Math.random() * 1000),
      email: this.formData.correo,
      password: this.formData.password,
      fullName: `${this.formData.nombres} ${this.formData.apellidos}`,
      firstName: this.formData.nombres,
      lastName: this.formData.apellidos,
      phone: this.formData.celular || undefined,
      address: this.formData.direccion || undefined,
      documentType: this.formData.tipoDocumento || undefined,
      documentNumber: this.formData.numDocumento || undefined,
      age: this.formData.edad || undefined,
      isActive: true
      // roleId: el backend asigna el rol 'usuario' por defecto
    };

    this.usersService.createUser(userDto).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        alert('✅ Usuario registrado exitosamente. Por favor, inicia sesión.');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = '❌ Error al registrar: ' + (error.error?.message || 'El correo ya existe');
        console.error('Register error:', error);
      }
    });
  }
}