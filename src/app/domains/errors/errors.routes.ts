import { Routes } from '@angular/router';

export const ERRORS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/layout').then((c) => c.Layout),
    children: [
      {
        path: '',
        redirectTo: 'forbidden',
        pathMatch: 'full',
      },
      {
        path: 'forbidden',
        title: '403 - Acceso Restringido',
        loadComponent: () => import('./pages/forbidden/forbidden').then((c) => c.Forbidden),
      },
      {
        path: 'not-found',
        title: '404 - Página No Encontrada',
        loadComponent: () => import('./pages/not-found/not-found').then((c) => c.NotFound),
      },
    ],
  },
];
