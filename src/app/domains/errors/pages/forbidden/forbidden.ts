import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Cognito } from '@shared/services/auth/cognito';
import { UserApi } from '@shared/services/api/user/user';

@Component({
  selector: 'app-forbidden',
  imports: [ButtonModule],
  templateUrl: './forbidden.html',
})
export class Forbidden {
  private readonly authService = inject(Cognito);
  private readonly userApi = inject(UserApi);
  private readonly router = inject(Router);

  readonly userEmail = computed(() => this.userApi.dbUser()?.email ?? null);

  async switchAccount(): Promise<void> {
    await this.authService.logout();
    await this.router.navigate(['/auth/login']);
  }
}
