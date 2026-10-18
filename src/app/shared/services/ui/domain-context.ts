import { computed, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, NavigationEnd, Route, Router, Routes } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

export const APP_DOMAINS = ['admin', 'auth'] as const;
export type AppDomain = (typeof APP_DOMAINS)[number];

export interface SidebarRouteData {
  icon?: string;
  group?: string;
  badge?: string;
  hidden?: boolean;
}

export interface SidebarNavSubItem {
  label: string;
  routerLink: string;
  isActive: boolean;
}

export interface SidebarNavItem {
  label: string;
  icon: string;
  routerLink: string;
  isActive: boolean;
  badge?: string;
  subItems?: SidebarNavSubItem[];
}

export interface SidebarNavGroup {
  label: string;
  items: SidebarNavItem[];
}

@Injectable({
  providedIn: 'root',
})
export class DomainContext {
  private readonly router = inject(Router);

  /** Señal interna con la URL actual sincronizada con el Router */
  readonly currentUrl = toSignal(
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

  /** Estado abierto/expandido del Sidebar */
  readonly isSidebarOpen = signal<boolean>(true);

  /** Indica si el dominio actual cuenta con Sidebar (oculto en 'auth') */
  readonly hasSidebar = computed<boolean>(() => {
    const domain = this.currentDomain();
    return domain !== null && domain !== 'auth';
  });

  /** Grupos de navegación generados automáticamente a partir de las rutas del dominio activo */
  readonly navGroups = computed<SidebarNavGroup[]>(() => {
    const url = this.currentUrl();
    const domain = this.currentDomain();
    if (!domain || domain === 'auth') {
      return [];
    }

    const domainRoutes = this.extractActiveDomainRoutes(this.router.routerState.snapshot.root);
    return this.buildNavGroups(domainRoutes, `/${domain}`, url);
  });

  toggleSidebar(): void {
    if (!this.hasSidebar()) return;
    this.isSidebarOpen.update((open) => !open);
  }

  openSidebar(): void {
    if (!this.hasSidebar()) return;
    this.isSidebarOpen.set(true);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }

  isDomain(domain: AppDomain): boolean {
    return this.currentDomain() === domain;
  }

  /**
   * Transforma un arreglo de Routes de Angular en grupos de navegación para el Sidebar.
   */
  buildNavGroups(
    routes: Routes,
    basePath = `/${this.currentDomain() ?? ''}`,
    activeUrl = this.currentUrl(),
  ): SidebarNavGroup[] {
    const normalizedRoutes = this.unwrapLayoutRoutes(routes);
    const cleanActiveUrl = activeUrl.split('?')[0].split('#')[0];
    const groupsMap = new Map<string, SidebarNavItem[]>();

    for (const route of normalizedRoutes) {
      if (!route.path || route.redirectTo) continue;

      const data = (route.data ?? {}) as SidebarRouteData;
      if (data.hidden) continue;

      const fullPath = `${basePath}/${route.path}`.replace(/\/+/g, '/');
      const label =
        typeof route.title === 'string' ? route.title : this.formatLabel(route.path);
      const icon = this.ensurePrimeIconClass(data.icon ?? 'pi pi-home');
      const groupName = data.group ?? 'Navegación';

      const subItems: SidebarNavSubItem[] = (route.children ?? [])
        .filter(
          (child) =>
            !!child.path &&
            !child.redirectTo &&
            !(child.data as SidebarRouteData | undefined)?.hidden,
        )
        .map((child) => {
          const subPath = `${fullPath}/${child.path}`.replace(/\/+/g, '/');
          const subLabel =
            typeof child.title === 'string' ? child.title : this.formatLabel(child.path!);
          return {
            label: subLabel,
            routerLink: subPath,
            isActive: cleanActiveUrl === subPath || cleanActiveUrl.startsWith(`${subPath}/`),
          };
        });

      const isActive =
        cleanActiveUrl === fullPath ||
        cleanActiveUrl.startsWith(`${fullPath}/`) ||
        subItems.some((sub) => sub.isActive);

      const navItem: SidebarNavItem = {
        label,
        icon,
        routerLink: fullPath,
        isActive,
        badge: data.badge,
        subItems: subItems.length > 0 ? subItems : undefined,
      };

      const existingGroup = groupsMap.get(groupName) ?? [];
      existingGroup.push(navItem);
      groupsMap.set(groupName, existingGroup);
    }

    return Array.from(groupsMap.entries()).map(([label, items]) => ({
      label,
      items,
    }));
  }

  private unwrapLayoutRoutes(routes: Routes): Routes {
    if (routes.length === 1 && routes[0].path === '' && routes[0].children) {
      return routes[0].children;
    }
    return routes;
  }

  private extractActiveDomainRoutes(root: ActivatedRouteSnapshot): Route[] {
    let current: ActivatedRouteSnapshot | null = root;
    while (current) {
      const config = current.routeConfig;
      if (config?.children && config.children.length > 0) {
        return config.children;
      }
      current = current.firstChild;
    }
    return [];
  }

  private ensurePrimeIconClass(icon: string): string {
    const trimmed = icon.trim();
    if (trimmed.startsWith('pi ')) return trimmed;
    if (trimmed.startsWith('pi-')) return `pi ${trimmed}`;
    return `pi pi-${trimmed}`;
  }

  private formatLabel(path: string): string {
    return path
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }
}
