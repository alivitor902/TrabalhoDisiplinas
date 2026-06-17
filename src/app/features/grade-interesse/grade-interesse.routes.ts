import { Routes } from '@angular/router';

export const GRADE_INTERESSE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/grade-interesse-lista/grade-interesse-lista').then(
        (m) => m.GradeInteresseLista
      )
  }
];
