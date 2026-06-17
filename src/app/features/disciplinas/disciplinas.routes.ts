import { Routes } from '@angular/router';

export const DISCIPLINAS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/disciplina-lista/disciplina-lista').then((m) => m.DisciplinaLista)
  },
  {
    path: 'novo',
    loadComponent: () =>
      import('./pages/disciplina-form/disciplina-form').then((m) => m.DisciplinaForm)
  },
  {
    path: 'editar/:id',
    loadComponent: () =>
      import('./pages/disciplina-form/disciplina-form').then((m) => m.DisciplinaForm)
  },
  {
    path: 'detalhes/:id',
    loadComponent: () =>
      import('./pages/disciplina-detalhes/disciplina-detalhes').then((m) => m.DisciplinaDetalhes)
  }
];
