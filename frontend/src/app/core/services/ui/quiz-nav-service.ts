import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class QuizNavService {
  // 1. Señal para la posición actual
  private _currentPosition = signal(0);
  public currentPosition = this._currentPosition.asReadonly();

  // 2. Señal para el total de preguntas (se actualizará dinámicamente)
  private _totalQuestions = signal(0);

  public setTotalQuestions(total: number) {
    this._totalQuestions.set(total);
  }

  public goToNextQuestion() {
    this._currentPosition.update(val =>
      // Math.min compara contra el total dinámico
      Math.min(val + 1, this._totalQuestions() - 1)
    );
  }

  public goToPrevQuestion() {
    this._currentPosition.update(val => Math.max(val - 1, 0));
  }

  // Método opcional para saltar a una pregunta específica (ej. para tu barra de navegación)
  public goToQuestion(index: number) {
    // Aseguramos que nunca sea mayor al índice máximo permitido
    const maxIndex = Math.max(0, this._totalQuestions() - 1);
    this._currentPosition.set(Math.min(index, maxIndex));
  }
}