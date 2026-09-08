import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { getCurrentUser } from 'aws-amplify/auth';

export const guestGuard: CanActivateFn = async () => {
  const router = inject(Router);

  try {
    await getCurrentUser();
    console.log('GUEST GUARD: Sesión activa, redirigiendo a admin');
    return router.createUrlTree(['/admin']);
  } catch {
    console.log('GUEST GUARD: Sin sesión, acceso permitido al login');
    return true;
  }
};
