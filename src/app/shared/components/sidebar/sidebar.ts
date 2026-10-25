import { Component, computed, inject, input, signal, ViewEncapsulation } from '@angular/core';
import { RouterLink, Routes } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import {
  SidebarCollapsible,
  SidebarNavGroup,
  SidebarNavItem,
  SidebarSide,
  SidebarVariant,
} from '@shared/models/navigation.model';
import { UserApi } from '@shared/services/api/user/user';
import { DomainContext } from '@shared/services/ui/domain-context';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, AvatarModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  encapsulation: ViewEncapsulation.None,
})
export class Sidebar {
  readonly domainContext = inject(DomainContext);
  readonly userApi = inject(UserApi);

  /** Opcional: rutas explícitas del dominio; si no se pasa, se leen automáticamente del Router */
  readonly routes = input<Routes | null>(null);

  /** Opciones de configuración visual idénticas a PrimeNG Sidebar */
  readonly variant = input<SidebarVariant>('floating');
  readonly collapsible = input<SidebarCollapsible>('offcanvas');
  readonly side = input<SidebarSide>('left');
  readonly overlay = input<boolean>(false);
  readonly backdrop = input<boolean>(false);
  readonly width = input<string>('16rem');
  readonly iconWidth = input<string>('3rem');

  /** Correo del usuario autenticado obtenido desde la DB */
  readonly userEmail = computed(() => this.userApi.dbUser()?.email ?? '');

  private readonly openSubMenus = signal<Record<string, boolean>>({});

  readonly open = this.domainContext.isSidebarOpen;

  readonly displayState = computed(() => (this.open() ? 'expanded' : 'collapsed'));

  readonly dataCollapsible = computed(() =>
    this.displayState() === 'collapsed' ? this.collapsible() : null,
  );

  readonly dataOverlay = computed(() => (this.overlay() ? '' : null));

  readonly navGroups = computed<SidebarNavGroup[]>(() => {
    const customRoutes = this.routes();
    if (customRoutes) {
      return this.domainContext.buildNavGroups(customRoutes);
    }
    return this.domainContext.navGroups();
  });

  toggle(): void {
    if (this.collapsible() === 'none') return;
    this.domainContext.toggleSidebar();
  }

  collapse(): void {
    if (this.collapsible() === 'none') return;
    this.domainContext.closeSidebar();
  }

  toggleSubMenu(item: SidebarNavItem): void {
    const current = this.isSubMenuOpen(item);
    this.openSubMenus.update((prev) => ({
      ...prev,
      [item.routerLink]: !current,
    }));
  }

  isSubMenuOpen(item: SidebarNavItem): boolean {
    const explicit = this.openSubMenus()[item.routerLink];
    if (explicit !== undefined) {
      return explicit;
    }
    return !!item.subItems?.some((s) => s.isActive);
  }
}
