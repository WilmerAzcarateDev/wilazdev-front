import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { getCurrentUser } from 'aws-amplify/auth';

export const guestGuard: CanActivateFn = async () => {
  const router = inject(Router);

  try {
    await getCurrentUser();
    return router.createUrlTree(['/admin']);
  } catch {
    return true;
  }
};
