import { Component, inject, HostListener, ViewChild, ElementRef, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from './modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  private readonly modalService = inject(ModalService);

  readonly config = this.modalService.config;
  readonly isOpen = this.modalService.isOpen;
  readonly componentType = this.modalService.componentType;

  readonly modalSize = computed(() => this.config()?.size ?? 'md');
  readonly componentData = computed(() => this.config()?.data ?? {});
  readonly hasComponent = computed(() => !!this.componentType());

  @ViewChild('modalContent') modalContent!: ElementRef<HTMLDivElement>;

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        // Register the save callback when modal opens
        this.modalService.registerSaveCallback((result: any) => {
          this.close();
        });
      }
    });
  }

  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    if (!this.isOpen()) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
      return;
    }

    if (event.key === 'Tab') {
      this.trapFocus(event);
    }
  }

  private trapFocus(event: KeyboardEvent): void {
    if (!this.modalContent) return;

    const focusableElements = this.modalContent.nativeElement.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  close(): void {
    this.modalService.onClosed();
  }

  confirm(): void {
    this.modalService.onConfirmed();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
}