import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing'

import { MainLayoutComponent } from './shared/layout/main-layout.component';
import { hasAnyRole } from './core/user.guard';
import { ErrorPageComponent } from './pages/errorPages/error';


export const routes: Routes = [
  // Rota pública
  { path: '', component: LandingComponent },

  // Rotas protegidas com layout
  {
    path: 'home',
    component: MainLayoutComponent,
    children: [
      {
        path: 'users',
        loadChildren: () =>
          import('./pages/users/users.routes').then(m => m.routes),
        canActivate: [hasAnyRole(['admin'])],
      },
      {
        path: 'academic',
        loadChildren: () =>
          import('./pages/academic/academic.routes').then(m => m.routes),
        canActivate: [hasAnyRole(['admin', 'coordenador', 'professor', 'aluno'])],
      }
    ]
  },
  // Rota de erro
  {
    path: 'error',
    component: ErrorPageComponent
  },

  // Rota de fallback
  { path: '**', redirectTo: '/error' }
];

