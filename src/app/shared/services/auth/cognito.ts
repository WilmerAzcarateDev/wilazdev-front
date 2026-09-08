import { Injectable, signal } from '@angular/core';
import {
  signInWithRedirect,
  signOut,
  getCurrentUser,
  fetchAuthSession,
  AuthUser
} from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

@Injectable({
  providedIn: 'root',
})
export class Cognito {
  readonly currentUser = signal<AuthUser|null > (null);
  readonly isAuthenticated = signal<boolean>(false);
  readonly isLoading = signal<boolean>(true);

  constructor(){
    this.checkSession();
    this.listenToAuthEvents();
  }

  async checkSession() {
    try {
      this.isLoading.set(true);
      const user = await getCurrentUser();
      this.currentUser.set(user);
      this.isAuthenticated.set(true);
    } catch {
      this.currentUser.set(null);
      this.isAuthenticated.set(false);
    } finally {
      this.isLoading.set(false);
    }
  }


  async loginWithGoogle() {
    await signInWithRedirect({provider: 'Google'});
  }

  async logout(){
    await signOut();
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }

  async getAccessToken() {
    try {
      const session = await fetchAuthSession();
      return session.tokens?.accessToken?.toString();
    } catch {
      return undefined;
    }
  }

  private listenToAuthEvents() {
    Hub.listen('auth', ({ payload }) => {
      console.log('Hub Auth Event:', payload.event, payload);
      switch (payload.event) {
        case 'signInWithRedirect':
        case 'signedIn':
          this.checkSession();
          break;
        case 'signInWithRedirect_failure':
          console.error('Error en el redirect de Google:', payload);
          this.isLoading.set(false);
          break;
        case 'signedOut':
          this.currentUser.set(null);
          this.isAuthenticated.set(false);
          this.isLoading.set(false);
          break;
      }
    });
  }

}
