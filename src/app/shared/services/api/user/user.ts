import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CheckUserResponse, DbUser } from '@shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserApi {
  private readonly http = inject(HttpClient);
  private readonly url = '/api/users';

  private checkUserInFlight: Promise<CheckUserResponse> | null = null;

  readonly dbUser = signal<DbUser | null>(null);

  async checkUser(): Promise<CheckUserResponse> {
    // Si ya tenemos el usuario sincronizado en esta sesión, no repetimos la llamada HTTP
    const existing = this.dbUser();
    if (existing) {
      return { user: existing, created: false };
    }

    // Si ya hay una petición en curso (ej. disparada casi al mismo tiempo por constructor y Hub),
    // reutilizamos la misma promesa para hacer 1 sola llamada a la Lambda
    if (this.checkUserInFlight) {
      return this.checkUserInFlight;
    }

    this.checkUserInFlight = firstValueFrom(
      this.http.get<CheckUserResponse>(`${this.url}/check-user`),
    )
      .then((response) => {
        this.dbUser.set(response.user);
        return response;
      })
      .finally(() => {
        this.checkUserInFlight = null;
      });

    return this.checkUserInFlight;
  }

  async getMe(): Promise<DbUser> {
    const user = await firstValueFrom(this.http.get<DbUser>(`${this.url}/me`));
    this.dbUser.set(user);
    return user;
  }

  clear(): void {
    this.dbUser.set(null);
    this.checkUserInFlight = null;
  }
}
