import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly STORAGE_KEY = 'movie-crud-theme';

  private readonly _theme = signal<ThemeMode>(this.getInitialTheme());
  readonly theme = this._theme.asReadonly();

  constructor() {
    if (this.isBrowser) {
      this.applyTheme(this._theme());
    }
  }

  private getInitialTheme(): ThemeMode {
    if (!this.isBrowser) return 'light';

    const stored = localStorage.getItem(this.STORAGE_KEY) as ThemeMode | null;
    // Only respect 'dark' from storage; treat anything else as light (gray theme)
    return stored === 'dark' ? 'dark' : 'light';
  }

  toggleTheme(): void {
    const newTheme = this._theme() === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  setTheme(theme: ThemeMode): void {
    this._theme.set(theme);
    if (this.isBrowser) {
      if (theme === 'dark') {
        localStorage.setItem(this.STORAGE_KEY, 'dark');
      } else {
        // Gray theme is default - don't store anything
        localStorage.removeItem(this.STORAGE_KEY);
      }
    }
    this.applyTheme(theme);
  }

  applyTheme(theme: ThemeMode): void {
    if (!this.isBrowser) return;
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      // Gray theme is default - remove attribute
      document.documentElement.removeAttribute('data-theme');
    }
  }
}