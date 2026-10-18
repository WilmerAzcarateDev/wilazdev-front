import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

export const APP_DOMAINS = ['admin', 'auth'] as const;
export type AppDomain = (typeof APP_DOMAINS)[number];

@Injectable({
  providedIn: 'root',
})
export class DomainContext {
  private readonly router = inject(Router);

  /** Señal interna con la URL actual sincronizada con el Router */
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  /** Dominio activo extraído del primer segmento de la ruta (ej. '/admin/home' -> 'admin') */
  readonly currentDomain = computed<AppDomain | null>(() => {
    const url = this.currentUrl();
    const cleanPath = url.split('?')[0].split('#')[0];
    const firstSegment = cleanPath.split('/').filter(Boolean)[0];

    if (firstSegment && (APP_DOMAINS as readonly string[]).includes(firstSegment)) {
      return firstSegment as AppDomain;
    }
    return null;
  });

  /** Estado reactivo de apertura del drawer (compatible con [(visible)]) */
  readonly isDrawerOpen = signal<boolean>(false);

  /** Indica si el dominio actual tiene un drawer disponible (ej. oculto en 'auth') */
  readonly hasDrawer = computed<boolean>(() => {
    const domain = this.currentDomain();
    return domain !== null && domain !== 'auth';
  });

  constructor() {
    // Cerrar el drawer automáticamente cuando cambie el dominio activo
    effect(() => {
      this.currentDomain();
      this.isDrawerOpen.set(false);
    });
  }

  openDrawer(): void {
    if (this.hasDrawer()) {
      this.isDrawerOpen.set(true);
    }
  }

  closeDrawer(): void {
    this.isDrawerOpen.set(false);
  }

  toggleDrawer(): void {
    if (this.hasDrawer()) {
      this.isDrawerOpen.update((open) => !open);
    }
  }

  isDomain(domain: AppDomain): boolean {
    return this.currentDomain() === domain;
  }
}
