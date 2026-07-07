import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SlideInModalService {

  private _isOpen = signal(false);


  isOpen = this._isOpen.asReadonly();

  open() { 
    this._isOpen.set(true); 
  }

  close() { 
    this._isOpen.set(false); 
  }
}