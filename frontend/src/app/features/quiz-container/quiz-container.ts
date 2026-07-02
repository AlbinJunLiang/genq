import { Component, inject, input, signal } from '@angular/core';
import { EvaluationRequest, Quiz, QuizApiResponse, QuizDetail } from '../../core/interfaces/quiz-interface';
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
import { QuizStateService } from '../../core/services/ui/quiz-state-service';



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
  protected attemptUuid = signal<string>('');
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
  private quizStateService = inject(QuizStateService);





  ngOnInit() {
    this.quizNavService.reset();
    this.loadQuiz();
  }

  private loadQuiz() {
    this.isLoading.set(true);

    // 1. Intentar cargar desde el storage
    const savedQuiz = this.quizStateService.loadFromStorage();

    if (savedQuiz) {
      this.applyDataToSignals(savedQuiz);
      this.isLoading.set(false);
    } else {
      // 2. Si no hay, cargar desde API
      this.quizService.startQuizByUuid(this.quizId()).subscribe({
        next: (data) => {
          if (!data.quiz.questions?.length) {
            this.snackbar.show("Quiz sin preguntas", 'Cerrar');
            this.router.navigate(['/home']);
            return;
          }

          // Inicializamos y aplicamos
          const initialized = this.quizStateService.initializeQuiz(data);
          this.applyDataToSignals(initialized);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.snackbar.show(err.error?.message === 'Quiz not found' ? "El quiz no existe" : "Error al cargar", 'Cerrar');
          this.router.navigate(['/home']);
        }
      });
    }
  }

  // Método único para evitar duplicar código
  private applyDataToSignals(data: QuizApiResponse) {
    this.quiz.set(data.quiz);
    this.attemptUuid.set(data.attemptUuid);
    this.quizNavService.setTotalQuestions(data.quiz.questions.length);
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
      attemptUuid: this.attemptUuid(),
      answers: this.userAnswers().map(ans => ({
        questionId: ans.questionId,
        answerIds: ans.answerIds
      }))
    };

    this.quizService.evaluateQuiz(currentQuiz.uuid, payload).subscribe({
      next: (result: EvaluationResult) => {
        this.quizStateService.clearStorage();
        this.evaluationResult.set(result);
        this.isFinalized.set(true);        // Cambiamos el estado a finalizado
        this.isLoading.set(false);

      },
      error: (err) => {
        console.error('Error al evaluar:', err);
        this.quizStateService.clearStorage();
        this.isLoading.set(false);

      }
    });
  }



  resetQuiz() {
    this.userAnswers.set([]);
    this.evaluationResult.set(null);
    this.isFinalized.set(false);
    this.quizNavService.goToQuestion(0);
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
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.resetQuiz();
      }
    });
  }


  onExitQuiz() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: this.quiz().title,
        message: this.quiz().description,
        confirmText: 'Salir del quiz',
        cancelText: 'Mejor no'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.resetQuiz();
        this.quizStateService.clearStorage();
        this.router.navigate(['/home']);
      }
    });
  }

}
