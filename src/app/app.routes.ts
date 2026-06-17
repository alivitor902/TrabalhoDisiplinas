import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./features/home/home').then((m) => m.Home)
  },
  {
    path: 'disciplinas',
    loadChildren: () =>
      import('./features/disciplinas/disciplinas.routes').then((m) => m.DISCIPLINAS_ROUTES)
  },
  {
    path: 'grade-interesse',
    loadChildren: () =>
      import('./features/grade-interesse/grade-interesse.routes').then((m) => m.GRADE_INTERESSE_ROUTES)
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
