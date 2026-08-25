import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/layout').then((c) => c.Layout),
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        title: 'Login',
        loadComponent: () => import('./pages/login/login').then((c) => c.Login),
      },
    ],
  },
];
