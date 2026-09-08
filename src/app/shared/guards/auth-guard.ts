import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { getCurrentUser } from 'aws-amplify/auth';

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);

  try {
    const user = await getCurrentUser();
    console.log('AUTH GUARD: Autenticado', user);
    return true;
  } catch (error) {
    console.log('AUTH GUARD: No autenticado, redirigiendo...');
    return router.createUrlTree(['/auth/login']);
  }
};
