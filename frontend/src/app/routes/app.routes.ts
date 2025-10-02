import { Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { authRoutes } from '../features/auth/auth-routing.module';
import { layoutRoutes } from '../core/components/layout/layout-routing.module';

export const routes: Routes = [
  // Rutas públicas
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { 
    path: 'auth', 
    children: authRoutes
  },
  
  // Rutas protegidas con layout
  { 
    path: '', 
    children: layoutRoutes,
    canActivate: [AuthGuard]
  },
  
  // Ruta por defecto
  { path: '**', redirectTo: '/auth/login' }
];
