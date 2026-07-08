import { Injectable, signal } from '@angular/core';
import { QuizVisibility } from '../../types/quiz-visibility';


@Injectable({
    providedIn: 'root'
})
export class QuizVisibilityService {
    // Signal para almacenar el estado actual
    private currentVisibility = signal<QuizVisibility>('GLOBAL');

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