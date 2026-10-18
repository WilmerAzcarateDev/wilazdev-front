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
        data: { icon: 'pi pi-home' },
        loadComponent: () => import('./pages/home/home').then((c) => c.Home),
      },
      {
        path: 'projects',
        title: 'Proyectos',
        data: { icon: 'pi pi-folder' },
        children: [
          {
            path: '',
            title: 'Proyectos',
            loadComponent: () => import('./pages/projects/projects').then((c) => c.Projects),
          },
          {
            path: ':id',
            title: 'Detalle de Proyecto',
            data: { hidden: true },
            loadComponent: () =>
              import('./pages/project-detail/project-detail').then((c) => c.ProjectDetail),
          },
        ],
      },
    ],
  },
];

