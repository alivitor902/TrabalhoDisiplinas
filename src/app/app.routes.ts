import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./features/home/home').then((m) => m.Home)
  },
  {
    path: 'disciplinas',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/disciplinas/disciplinas.routes').then((m) => m.DISCIPLINAS_ROUTES)
  },
  {
    path: 'grade-interesse',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/grade-interesse/grade-interesse.routes').then((m) => m.GRADE_INTERESSE_ROUTES)
  },
  {
    path: 'usuarios',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/usuarios/usuarios.routes').then((m) => m.USUARIOS_ROUTES)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/usuarios/pages/login/login').then((m) => m.Login)
  },
  {
    path: 'sobre',
    loadComponent: () => import('./features/sobre/sobre').then((m) => m.Sobre)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
