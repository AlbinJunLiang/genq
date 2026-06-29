import { Component, inject, input, signal } from '@angular/core';
import { EvaluationRequest, Quiz, QuizDetail } from '../../core/interfaces/quiz-interface';
import { QuestionFromQuiz } from '../../core/interfaces/question-interface';
import { Answer } from '../../core/interfaces/answer-interface';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatAnchor, MatIconButton } from "@angular/material/button";
import { QuizNavbar } from "../quiz-navbar/quiz-navbar";
import { QuizNavService } from '../../core/services/ui/quiz-nav-service';
import { UserAnswer } from '../../core/interfaces/user-answer-interface';
import { getRandomInt } from '../../shared/util/random-string';
import { QuizService } from '../../core/services/api/quiz-service';
import { INITIAL_QUIZ_MOCK } from '../../core/services/mocks/quiz-start-mock';
import { EvaluationResult } from '../../core/interfaces/quiz-review-interface';
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { SnackBarService } from '../../core/services/ui/snackbar-service';
import { Router } from '@angular/router';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/component/confirm/dialog-component';
import { BreakpointService } from '../../core/services/ui/breakpoint-service';



@Component({
  selector: 'app-quiz-container',
  imports: [MatAnchor, QuizNavbar, MatIconButton, MatIconModule, MatProgressSpinner],
  templateUrl: './quiz-container.html',
  styleUrl: './quiz-container.scss',
})
export class QuizContainer {

  protected quizId = input.required<string>();
  protected userAnswers = signal<UserAnswer[]>([]);
  protected quizNavService = inject(QuizNavService);
  protected isFinalized = signal<boolean>(false);
  protected quiz = signal<QuizDetail>({
    id: 0,
    uuid: "",
    title: "",
    description: "",
    visibility: "PUBLIC",
    endAt: new Date().toISOString(),
    durationSeconds: 0,
    attemptsLimit: 1,
    userId: 0,
    createdAt: new Date().toISOString(),
    questions: []
  });

  protected isLoading = signal(false);
  private quizService = inject(QuizService);
  protected evaluationResult = signal<EvaluationResult | null>(null);
  private snackbar = inject(SnackBarService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private breakpointService = inject(BreakpointService);
  protected isMobile = this.breakpointService.isMobile;





  ngOnInit() {
    this.loadQuiz();
  }

  private loadQuiz() {
    this.isLoading.set(true);
    this.quizService.startQuizByUuid(this.quizId()).subscribe({
      next: (data) => {

        if (data.questions.length === 0) {
          this.snackbar.show("Quiz sin preguntas", 'Cerrar');
          this.router.navigate(['/home']);
        }

        // 1. Transformamos los datos (agregamos isSelected)
        const initializedQuiz = {
          ...data,
          questions: data.questions.map(q => ({
            ...q,
            answers: q.answers.map(a => ({ ...a, isSelected: false }))
          }))
        };

        this.quiz.set(initializedQuiz);
        this.quizNavService.setTotalQuestions(initializedQuiz.questions.length);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Error al cargar el quiz', err);
        if (err.error.message === 'Quiz not found') {
          this.snackbar.show("EL quiz no existe..", 'Cerrar');

        } else {
          this.snackbar.show("Error al cargar el quiz.", 'Cerrar');

        }
        this.router.navigate(['/home']);

      }
    });
  }



  selectAnswer(question: QuestionFromQuiz, selectedAnswer: Answer) {
    this.quiz.update(currentQuiz => {
      // 1. Clonamos el quiz para mantener la inmutabilidad
      const newQuestions = currentQuiz.questions.map(q => {
        if (q.id !== question.id) return q;

        // 2. Clonamos la pregunta y sus respuestas
        const newAnswers = q.answers.map(a => {
          if (q.type === 'UNIQUE') {
            return { ...a, isSelected: a.id === selectedAnswer.id };
          } else {
            return a.id === selectedAnswer.id
              ? { ...a, isSelected: !a.isSelected }
              : a;
          }
        });

        return { ...q, answers: newAnswers };
      });

      return { ...currentQuiz, questions: newQuestions };
    });

    // 3. Después de actualizar el estado, guardamos la respuesta en userAnswers
    // Necesitamos buscar la pregunta recién actualizada
    const updatedQuestion = this.quiz().questions.find(q => q.id === question.id)!;
    this.saveAnswer(updatedQuestion);
  }


  private saveAnswer(question: QuestionFromQuiz) {
    const selectedIds = question.answers
      .filter(answer => answer.isSelected)
      .map(answer => answer.id);

    this.userAnswers.update(current => {
      // Si no hay nada seleccionado, eliminamos la pregunta del array
      if (selectedIds.length === 0) {
        return current.filter(item => item.questionId !== question.id);
      }

      // Si ya existe, actualizamos
      const exists = current.some(item => item.questionId === question.id);
      if (exists) {
        return current.map(item =>
          item.questionId === question.id ? { ...item, answerIds: selectedIds } : item
        );
      }

      // Si no existe, agregamos
      return [...current, { questionId: question.id, answerIds: selectedIds }];
    });
  }



  protected isCurrentQuestionAnswered(): boolean {
    const position = this.quizNavService.currentPosition();
    const currentQuestion = this.quiz()?.questions?.[position];

    // Si no existe la pregunta, retornar false para deshabilitar el botón
    if (!currentQuestion) return false;

    return this.userAnswers().some(
      a => a.questionId === currentQuestion.id && a.answerIds.length > 0
    );
  }


  protected evaluateQuiz() {
    this.isLoading.set(true);

    const currentQuiz = this.quiz();
    if (!currentQuiz || this.isFinalized()) return;

    const payload: EvaluationRequest = {
      quizId: currentQuiz.id,
      attemptId: "550e8400-e29b-41d4-a716-446655440000",
      answers: this.userAnswers().map(ans => ({
        questionId: ans.questionId,
        answerIds: ans.answerIds
      }))
    };

    this.quizService.evaluateQuiz(currentQuiz.uuid, payload).subscribe({
      next: (result: EvaluationResult) => {
        this.evaluationResult.set(result);

        this.isFinalized.set(true);        // Cambiamos el estado a finalizado
        this.isLoading.set(false);

      },
      error: (err) => {
        console.error('Error al evaluar:', err);
        this.isLoading.set(false);

      }
    });
  }



  resetQuiz() {
    // 1. Limpiamos las respuestas del usuario acumuladas
    this.userAnswers.set([]);

    // 2. Limpiamos el resultado de la evaluación
    this.evaluationResult.set(null);
    // 3. Volvemos al estado inicial (no finalizado)
    this.isFinalized.set(false);

    // 4. Reiniciamos la posición del nav (opcional, pero recomendado)
    this.quizNavService.goToQuestion(0);
    // 5. Volvemos a cargar los datos del quiz desde el servidor
    // Esto refrescará la señal this.quiz() con los valores iniciales (sin isSelected: true)
    this.loadQuiz();
  }


  onResetQuiz() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Reiniciar quiz',
        message: `¿Deseas reiniciar el quiz de ${this.quiz().title}?`,
        confirmText: 'Reiniciar',
        cancelText: 'Mejor no',
        color: 'warn'
      }
    });      // Bloqueamos la UI para evitar múltiples clics

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.resetQuiz();
      }
    });
  }

}
