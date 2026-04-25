import { Routes } from '@angular/router';
import { Login } from './component/login/login';
import { Register } from './component/register/register';
import { Inicio } from './component/inicio/inicio';
import { SobreNosotros } from './component/sobre-nosotros/sobre-nosotros';
import { Adopcion } from './component/adopcion/adopcion';
import { Tienda } from './component/tienda/tienda';
import { Reporte } from './component/reporte/reporte';
import { Calificacion } from './component/calificacion/calificacion';
import { Veterinario } from './component/veterinario/veterinario';
import { PerfilVeterinario } from './component/perfil-veterinario/perfil-veterinario';
import { PerfilUsuario } from './component/perfil-usuario/perfil-usuario';
import { Perfil } from './component/perfil/perfil';
import { PanelAdmin } from './component/panel-admin/panel-admin';
import { PasarelaPagos } from './component/pasarela-pagos/pasarela-pagos';
import { Recovery } from './component/recovery/recovery';
import { Servicios } from './component/servicios/servicios';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { VeterinarioGuard } from './guards/veterinario.guard';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'recovery', component: Recovery },
  
  // Rutas protegidas - requieren autenticación
  { 
    path: 'inicio', 
    component: Inicio,
    canActivate: [AuthGuard],
    data: { roles: [1, 2, 3, 4] } // Todos los roles pueden acceder
  },
  { 
    path: 'sobre-nosotros', 
    component: SobreNosotros,
    canActivate: [AuthGuard],
    data: { roles: [1, 2, 3, 4] }
  },
  { 
    path: 'adopcion', 
    component: Adopcion,
    canActivate: [AuthGuard],
    data: { roles: [1, 2, 3, 4] }
  },
  { 
    path: 'tienda', 
    component: Tienda,
    canActivate: [AuthGuard],
    data: { roles: [1, 2, 3, 4] }
  },
  { 
    path: 'reporte', 
    component: Reporte,
    canActivate: [AuthGuard],
    data: { roles: [1, 2, 3, 4] }
  },
  { 
    path: 'calificacion', 
    component: Calificacion,
    canActivate: [AuthGuard],
    data: { roles: [1, 2, 3, 4] }
  },
  { 
    path: 'veterinario', 
    component: Veterinario,
    canActivate: [AuthGuard],
    data: { roles: [1, 2, 3, 4] }
  },
  { 
    path: 'servicios', 
    component: Servicios,
    canActivate: [AuthGuard],
    data: { roles: [1, 2, 3, 4] }
  },
  { 
    path: 'pasarela-pagos', 
    component: PasarelaPagos,
    canActivate: [AuthGuard],
    data: { roles: [1, 2, 3, 4] }
  },
  // Rutas específicas por rol
  { 
    path: 'perfil-usuario', 
    component: PerfilUsuario,
    canActivate: [AuthGuard],
    data: { roles: [4] } // Solo usuarios
  },
  { 
    path: 'perfil', 
    component: Perfil,
    canActivate: [AuthGuard],
    data: { roles: [4] } // Solo usuarios
  },
  { 
    path: 'perfil-veterinario', 
    component: PerfilVeterinario,
    canActivate: [AuthGuard],
    data: { roles: [3] } // Solo veterinarios
  },
  { 
    path: 'panel-admin', 
    component: PanelAdmin,
    canActivate: [AdminGuard] // Solo superadmin y admin
  }
];