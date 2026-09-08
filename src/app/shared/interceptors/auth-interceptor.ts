import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Cognito } from '@shared/services/auth/cognito';
import { from, switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Cognito);

  return from(authService.getAccessToken()).pipe(
    switchMap(token => {
      if(token){
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        })
      }
      return next(req);
    })
  )
};
