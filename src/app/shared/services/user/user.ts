import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export interface DbUser {
  id: number;
  cognito_sub: string;
  username: string;
  email: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CheckUserResponse {
  user: DbUser;
  created: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UserApi {
  private readonly http = inject(HttpClient);
  private readonly url = '/api/users';

  readonly dbUser = signal<DbUser | null>(null);

  async checkUser(): Promise<CheckUserResponse> {
    const response = await firstValueFrom(
      this.http.get<CheckUserResponse>(`${this.url}/check-user`)
    );
    this.dbUser.set(response.user);
    return response;
  }

  async getMe(): Promise<DbUser> {
    const user = await firstValueFrom(this.http.get<DbUser>(`${this.url}/me`));
    this.dbUser.set(user);
    return user;
  }
}
