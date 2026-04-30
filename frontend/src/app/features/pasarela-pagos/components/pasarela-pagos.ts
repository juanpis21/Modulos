import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pasarela-pagos',
  standalone: true,
  imports: [],
  templateUrl: './pasarela-pagos.html',
  styleUrl: './pasarela-pagos.scss',
})
export class PasarelaPagos {
  
  constructor(private router: Router) {}

  returnToStore(): void {
    this.router.navigate(['/tienda']);
  }
}
