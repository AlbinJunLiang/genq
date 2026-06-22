import { Injectable, signal } from "@angular/core";
import { Quiz } from "../../interfaces/quiz-interface";



@Injectable({ providedIn: 'root' })
export class SelectedQuizService {
  private _selectedQuiz = signal<Quiz | null>(null);
  readonly selectedQuiz = this._selectedQuiz.asReadonly();

  setSelectedQuiz(quiz: Quiz | null): void {
    this._selectedQuiz.set(quiz);
  }

  clearSelectedQuiz(): void {
    this._selectedQuiz.set(null);
  }
}