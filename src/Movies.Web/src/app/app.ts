import { Component, signal, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModalComponent } from './shared/components/modal/modal.component';
import { ModalService } from './shared/components/modal/modal.service';
import { ThemeService } from './core/services/theme.service';

@Component({
  imports: [RouterOutlet, ModalComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
  providers: [ModalService, ThemeService]
})
export class App {
  protected readonly title = signal('Movies.Web');
  protected readonly themeService = inject(ThemeService);
  private readonly modalService = inject(ModalService);

  constructor() {
    // Apply theme on initialization and whenever it changes
    effect(() => {
      this.themeService.applyTheme(this.themeService.theme());
    });
  }

  protected onModalClosed(): void {
    this.modalService.onClosed();
  }

  protected onModalConfirmed(): void {
    this.modalService.onConfirmed();
  }

  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  protected currentTheme(): string {
    return this.themeService.theme();
  }
}