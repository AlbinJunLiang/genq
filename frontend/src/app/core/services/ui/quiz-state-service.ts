import { Injectable, signal } from '@angular/core';
import { QuizApiResponse } from '../../interfaces/quiz-interface';

@Injectable({ providedIn: 'root' })
export class QuizStateService {
    private readonly STORAGE_KEY = 'geq_quiz_in_progress';
    currentQuiz = signal<QuizApiResponse | null>(null);

    initializeQuiz(data: QuizApiResponse): QuizApiResponse {
        const initializedData: QuizApiResponse = {
            ...data,
            quiz: {
                ...data.quiz,
                questions: data.quiz.questions.map((q) => ({
                    ...q,
                    answers: q.answers.map((a) => ({ ...a, isSelected: false }))
                }))
            }
        };

        this.currentQuiz.set(initializedData);
        this.saveToStorage(initializedData);
        return initializedData;
    }



    private saveToStorage(data: QuizApiResponse): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }

    loadFromStorage(): QuizApiResponse | null {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (!saved) return null;

        try {
            const parsed = JSON.parse(saved);
            // Validamos estructura mínima antes de retornar
            return (parsed && parsed.quiz && parsed.quiz.questions) ? parsed : null;
        } catch (e) {
            this.clearStorage();
            return null;
        }
    }

    clearStorage(): void {
        localStorage.removeItem(this.STORAGE_KEY);
    }
}