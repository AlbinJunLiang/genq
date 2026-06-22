import { Component, signal } from '@angular/core';
import { Quiz, QuizDetail } from '../../core/interfaces/quiz-interface';

@Component({
  selector: 'app-quiz-container',
  imports: [],
  templateUrl: './quiz-container.html',
  styleUrl: './quiz-container.scss',
})
export class QuizContainer {

  quizEjemplo: QuizDetail = {
    id: 42,
    uuid: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    title: "Fundamentos de Computación",
    description: "Evaluación sobre arquitectura de sistemas y memoria.",
    visibility: "PUBLIC",
    endAt: "2026-07-15T14:30:00.000Z",
    durationSeconds: 1800,
    attemptsLimit: 2,
    userId: 12,
    createdAt: "2026-06-20T10:00:00.000Z",
    questions: [
      {
        id: 101,
        content: "¿Qué componente es el responsable de realizar cálculos aritméticos?",
        type: "MULTIPLE",
        status: "ACTIVE",
        quizId: 42,
        answers: [
          { id: 1, content: "Unidad de Control", status: "ACTIVE", questionId: 101 },
          { id: 2, content: "ALU (Unidad Aritmético Lógica)", status: "ACTIVE", questionId: 101 },
          { id: 3, content: "Registro de instrucción", status: "ACTIVE", questionId: 101 }
        ]
      }
    ]
  };

  protected isActive = signal(true);

  toggleClase() {
    this.isActive.update(valor => !valor);
  }

}
