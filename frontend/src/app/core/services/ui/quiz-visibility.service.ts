import { Injectable, signal, computed } from '@angular/core';

// Definimos los tipos de visibilidad para mayor seguridad
export type QuizVisibility = 'PUBLIC' | 'PRIVATE' | 'ACCESS_ONLY_VIA_LINK' | 'ALL' | 'GLOBAL';

@Injectable({
    providedIn: 'root'
})
export class QuizVisibilityService {
    // Signal para almacenar el estado actual
    private currentVisibility = signal<QuizVisibility>('ALL');

    // Signal pública (de solo lectura para los componentes)
    public visibility = this.currentVisibility.asReadonly();

    // Método para cambiar el filtro
    setFilter(filter: QuizVisibility) {
        this.currentVisibility.set(filter);
    }

    // Opcional: Para verificar fácilmente el estado
    isCurrentFilter(filter: QuizVisibility): boolean {
        return this.currentVisibility() === filter;
    }
}