import { Injectable, signal, computed, Type } from '@angular/core';

export interface ModalConfig<T = unknown> {
  component: Type<T>;
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  data?: Partial<T>;
  showCloseButton?: boolean;
  onSave?: (result: any) => void;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private readonly _isOpen = signal(false);
  private readonly _config = signal<ModalConfig | null>(null);
  private readonly _componentRef = signal<any>(null);
  private _saveCallback: ((result: any) => void) | null = null;

  readonly isOpen = computed(() => this._isOpen());
  readonly config = computed(() => this._config());
  readonly componentType = computed(() => this._config()?.component);

  open<T>(config: ModalConfig<T>): Promise<any> {
    return new Promise((resolve) => {
      this._config.set(config);
      this._isOpen.set(true);
      this._saveCallback = config.onSave ?? null;

      const componentRef = {
        resolve,
        closed: false
      };
      this._componentRef.set(componentRef);
    });
  }

  close(result?: any): void {
    const ref = this._componentRef();
    if (ref && !ref.closed) {
      ref.closed = true;
      ref.resolve(result);
    }
    this._isOpen.set(false);
    this._config.set(null);
    this._componentRef.set(null);
    this._saveCallback = null;
  }

  onClosed(): void {
    this.close();
  }

  onConfirmed(): void {
    const ref = this._componentRef();
    if (ref && !ref.closed) {
      ref.closed = true;
      ref.resolve({ confirmed: true });
    }
    this._isOpen.set(false);
    this._config.set(null);
    this._componentRef.set(null);
    this._saveCallback = null;
  }

  // Register a save callback that the modal component can call
  registerSaveCallback(callback: (result: any) => void): void {
    this._saveCallback = callback;
  }

  // Call this when the form inside the modal saves successfully
  notifySave(result: any): void {
    if (this._saveCallback) {
      this._saveCallback(result);
    }
    this.close(result);
  }
}