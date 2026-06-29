import { Injectable, inject, signal } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

@Injectable({ providedIn: 'root' })
export class BreakpointService {
  private breakpointObserver = inject(BreakpointObserver);

  // Señal que indica si es mobile
  public isMobile = signal(false);

  constructor() {
    this.breakpointObserver
      .observe('(max-width: 768px)')
      .subscribe(result => {
        this.isMobile.set(result.matches);
      });
  }
}