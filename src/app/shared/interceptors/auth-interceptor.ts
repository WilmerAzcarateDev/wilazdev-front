import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Cognito } from '@shared/services/auth/cognito';
import { from, switchMap } from 'rxjs';
import { environment } from '@env/environment';

type GatewayKey = keyof typeof environment.gateways;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Cognito);
  const gateways: Record<string, string> = environment.gateways;

  // Detectamos si la URL sigue el patrón '/<gatewayKey>/<ruta>' (ej. '/api/users/check-user')
  if (req.url.startsWith('/')) {
    const [, gatewayKey, ...restSegments] = req.url.split('/');
    const baseUrl = gateways[gatewayKey as GatewayKey];

    if (baseUrl) {
      const normalizedBase = baseUrl.replace(/\/+$/, '');
      const targetUrl = `${normalizedBase}/${restSegments.join('/')}`;

      // Si el destino es 'api', adjuntamos automáticamente el Bearer Token de Cognito
      if (gatewayKey === 'api') {
        return from(authService.getAccessToken()).pipe(
          switchMap((token) => {
            const updatedReq = req.clone({
              url: targetUrl,
              setHeaders: token ? { Authorization: `Bearer ${token}` } : {},
            });
            return next(updatedReq);
          })
        );
      }

      // Para otros servicios configurados en gateways (ej. 'ia'), reescribimos la URL base
      return next(req.clone({ url: targetUrl }));
    }
  }

  return next(req);
};
