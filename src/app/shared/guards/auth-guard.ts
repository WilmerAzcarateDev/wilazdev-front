import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { getCurrentUser } from 'aws-amplify/auth';
import { UserApi } from '@shared/services/api/user/user';

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const userApi = inject(UserApi);

  try {
    await getCurrentUser();
  } catch {
    return router.createUrlTree(['/auth/login']);
  }

  try {
    const { user } = await userApi.checkUser();
    if (!user.is_admin) {
      return router.createUrlTree(['/errors/forbidden']);
    }
    return true;
  } catch {
    return router.createUrlTree(['/errors/forbidden']);
  }
};

