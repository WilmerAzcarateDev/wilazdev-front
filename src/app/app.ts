import { Component, computed, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Theme as ThemeService } from '@shared/services/ui/theme';
import { Cognito } from '@shared/services/auth/cognito';
import { SpeedDialModule } from 'primeng/speeddial';
import { MenuItem } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    SpeedDialModule,
    ButtonDirective
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  themeService = inject(ThemeService);
  authService = inject(Cognito);
  router = inject(Router);

  themeIcon = computed(() => {
    return this.themeService.isDarkMode() ? 'pi pi-moon' : 'pi pi-sun';
  });

  controlOptions = computed<MenuItem[]>(() => {
    let options = [
      {
        icon: this.themeIcon(),
        label: 'Tema',
        command: () => this.changeTheme()
      },
    ];
    if (this.authService.isAuthenticated()) options = [
      ...options,
      {
        icon: 'pi pi-sign-out',
        label: 'Cerrar sesión',
        command: () => this.logout()
      }
    ]
    return options;
  });

  changeTheme() {
    this.themeService.toggleTheme();
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
