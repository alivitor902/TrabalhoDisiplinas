import { Routes } from '@angular/router';

export const USUARIOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/usuario-lista/usuario-lista').then((m) => m.UsuarioLista)
  },
  {
    path: 'novo',
    loadComponent: () =>
      import('./pages/usuario-form/usuario-form').then((m) => m.UsuarioForm)
  },
  {
    path: 'editar/:id',
    loadComponent: () =>
      import('./pages/usuario-form/usuario-form').then((m) => m.UsuarioForm)
  }
];
