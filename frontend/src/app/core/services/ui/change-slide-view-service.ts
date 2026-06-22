// services/modal.service.ts
import { computed, Injectable, signal } from '@angular/core';
import { SlideView } from '../../enums/auth-form-type';

@Injectable({ providedIn: 'root' })
export class ChangeSlideViewService {
    // Estado privado (solo el servicio puede modificarlo)
    private _view = signal<SlideView>(SlideView.LOGIN);

    // Exponemos la vista como una señal de solo lectura
    public currentView = this._view.asReadonly();

    // COMPUTED: Derivamos estados complejos de forma eficiente
    isAuthView = computed(() => {
        return this._view() === SlideView.LOGIN || this._view() === SlideView.REGISTER;
    });

    setView(view: SlideView) {
        this._view.set(view);
    }
}