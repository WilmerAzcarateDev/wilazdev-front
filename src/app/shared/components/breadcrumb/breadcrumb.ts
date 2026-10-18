import { Component, computed, inject, input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DomainContext } from '@shared/services/ui/domain-context';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [BreadcrumbModule],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.css',
})
export class Breadcrumb {
  readonly domainContext = inject(DomainContext);

  /** Opcional: permite sobreescribir los items manualmente si una vista específica lo requiere */
  readonly customItems = input<MenuItem[] | null>(null, { alias: 'items' });

  /** Opcional: permite sobreescribir el ítem Home del dominio */
  readonly customHome = input<MenuItem | null>(null, { alias: 'home' });

  readonly items = computed<MenuItem[]>(() => {
    return this.customItems() ?? this.domainContext.breadcrumbItems();
  });

  readonly home = computed<MenuItem>(() => {
    return this.customHome() ?? this.domainContext.breadcrumbHome();
  });
}
