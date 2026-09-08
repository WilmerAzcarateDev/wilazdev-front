import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth-guard';
import { guestGuard } from './shared/guards/guest-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadChildren: () => import('./domains/auth/auth.routes').then((r) => r.AUTH_ROUTES),
  },
  {
    path: 'admin',
    canActivate:[authGuard],
    loadChildren: () => import('./domains/admin/admin.routes').then((r)=>r.ADMIN_ROUTES)
  }
];
