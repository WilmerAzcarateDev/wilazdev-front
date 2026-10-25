import { MenuItem } from 'primeng/api';

export const APP_DOMAINS = ['admin', 'auth', 'errors'] as const;
export type AppDomain = (typeof APP_DOMAINS)[number];

/** Configuración del ítem raíz (home) del Breadcrumb por cada dominio */
export const DOMAIN_BREADCRUMB_HOME: Record<AppDomain, MenuItem> = {
  admin: { icon: 'pi pi-home', routerLink: '/admin/home' },
  auth: { icon: 'pi pi-lock', routerLink: '/auth/login' },
  errors: { icon: 'pi pi-exclamation-triangle', routerLink: '/errors/forbidden' },
};

export interface SidebarRouteData {
  icon?: string;
  group?: string;
  badge?: string;
  hidden?: boolean;
  breadcrumb?: string;
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

export type SidebarVariant = 'sidebar' | 'floating' | 'inset';
export type SidebarCollapsible = 'offcanvas' | 'icon' | 'none';
export type SidebarSide = 'left' | 'right';
