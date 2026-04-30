import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Recovery } from './auth/recovery/recovery';
import { Inicio } from './features/inicio/components/inicio';
import { SobreNosotros } from './features/sobre-nosotros/components/sobre-nosotros';
import { Adopcion } from './features/adopcion/components/adopcion';
import { Tienda } from './features/tienda/components/tienda';
import { Reporte } from './features/reporte/components/reporte';
import { Calificacion } from './features/calificacion/components/calificacion';
import { Veterinario } from './features/veterinario/components/veterinario';
import { PerfilVeterinario } from './features/perfil-veterinario/components/perfil-veterinario';
import { PerfilUsuario } from './features/perfil-usuario/components/perfil-usuario';
import { PanelAdmin } from './features/panel-admin/components/panel-admin';
import { PasarelaPagos } from './features/pasarela-pagos/components/pasarela-pagos';
import { Servicios } from './features/servicios/components/servicios';
import { permissionGuard } from './core/guards/permission.guard';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'recovery', component: Recovery },
  
  { 
    path: 'inicio', 
    component: Inicio,
    canActivate: [permissionGuard],
    data: { module: 'inicio' } 
  },
  { 
    path: 'sobre-nosotros', 
    component: SobreNosotros,
    canActivate: [permissionGuard],
    data: { module: 'sobre-nosotros' }
  },
  { 
    path: 'adopcion', 
    component: Adopcion,
    canActivate: [permissionGuard],
    data: { module: 'adopcion' }
  },
  { 
    path: 'tienda', 
    component: Tienda,
    canActivate: [permissionGuard],
    data: { module: 'tienda' }
  },
  { 
    path: 'reporte', 
    component: Reporte,
    canActivate: [permissionGuard],
    data: { module: 'reporte' }
  },
  { 
    path: 'calificacion', 
    component: Calificacion,
    canActivate: [permissionGuard],
    data: { module: 'calificacion' }
  },
  { 
    path: 'veterinario', 
    component: Veterinario,
    canActivate: [permissionGuard],
    data: { module: 'veterinario' }
  },
  { 
    path: 'servicios', 
    component: Servicios,
    canActivate: [permissionGuard],
    data: { module: 'servicios' }
  },
  { 
    path: 'pasarela-pagos', 
    component: PasarelaPagos,
    canActivate: [permissionGuard],
    data: { module: 'pasarela-pagos' }
  },
  { 
    path: 'perfil-usuario', 
    component: PerfilUsuario,
    canActivate: [permissionGuard],
    data: { module: 'perfil-usuario' }
  },
  { 
    path: 'perfil-veterinario', 
    component: PerfilVeterinario,
    canActivate: [permissionGuard],
    data: { module: 'perfil-veterinario' }
  },
  { 
    path: 'panel-admin', 
    component: PanelAdmin,
    canActivate: [permissionGuard],
    data: { module: 'panel-admin' }
  }
];