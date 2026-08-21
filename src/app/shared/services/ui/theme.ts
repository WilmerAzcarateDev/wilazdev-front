import { isPlatformBrowser } from '@angular/common';
import { effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Theme {
  private platformId = inject(PLATFORM_ID);
  private readonly STORAGE_KEY = 'app-theme';
  readonly isDarkMode = signal<boolean>(this.getInitialTheme());

  constructor(){
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        const isDark = this.isDarkMode();
        const root = document.documentElement;

        if (isDark) {
          root.classList.add('dark', 'my-app-dark');
          localStorage.setItem(this.STORAGE_KEY, 'dark');
        } else {
          root.classList.remove('dark', 'my-app-dark');
          localStorage.setItem(this.STORAGE_KEY, 'light');
        }
      }
    });
  }

  toggleTheme(): void {
    this.isDarkMode.update((prev) => !prev);
  }

  private getInitialTheme(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;

    const savedTheme = localStorage.getItem(this.STORAGE_KEY);
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}
