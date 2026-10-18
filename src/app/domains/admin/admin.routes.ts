import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/layout').then((c) => c.Layout),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        title: 'Home',
        data: { icon: 'pi pi-home', group: 'Navegación' },
        loadComponent: () => import('./pages/home/home').then((c) => c.Home),
      },
    ],
  },
];
