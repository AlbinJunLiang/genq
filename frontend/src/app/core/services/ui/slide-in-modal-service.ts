import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SlideInModalService {
  // 1. La señal privada para proteger el estado
  private _isOpen = signal(false);

  // 2. Exponemos una versión de solo lectura para los componentes
  // Esto evita que componentes externos cambien el estado directamente
  isOpen = this._isOpen.asReadonly();

  open() { 
    this._isOpen.set(true); 
  }

  close() { 
    this._isOpen.set(false); 
  }
}