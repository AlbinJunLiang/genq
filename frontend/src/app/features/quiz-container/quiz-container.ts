import { Component, inject, signal } from '@angular/core';
import { EvaluationRequest, Quiz, QuizDetail } from '../../core/interfaces/quiz-interface';
import { QuestionFromQuiz } from '../../core/interfaces/question-interface';
import { Answer } from '../../core/interfaces/answer-interface';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatAnchor } from "@angular/material/button";
import { QuizNavbar } from "../quiz-navbar/quiz-navbar";
import { QuizNavService } from '../../core/services/ui/quiz-nav-service';
import { UserAnswer } from '../../core/interfaces/user-answer-interface';
import { getRandomInt } from '../../shared/util/random-string';
import { QuizService } from '../../core/services/api/quiz-service';
import { INITIAL_QUIZ_MOCK } from '../../core/services/mocks/quiz-start-mock';
import { EvaluationResult } from '../../core/interfaces/quiz-review-interface';



@Component({
  selector: 'app-quiz-container',
  imports: [MatAnchor, QuizNavbar],
  templateUrl: './quiz-container.html',
  styleUrl: './quiz-container.scss',
})
export class QuizContainer {
  protected userAnswers = signal<UserAnswer[]>([]);
  protected quizNavService = inject(QuizNavService);

  protected quiz = signal<QuizDetail>(INITIAL_QUIZ_MOCK);

  private breakpointObserver = inject(BreakpointObserver);

  protected isMobile = signal(false);
  protected isLoading = signal(false);
  private quizService = inject(QuizService);

  constructor() {
    this.breakpointObserver
      .observe('(max-width: 768px)')
      .subscribe(result => {
        this.isMobile.set(result.matches);
      });
  }
  ngOnInit() {


    this.isLoading.set(true);
    this.quizService.getQuizByUuid('27ea4c0a-5602-4e9b-9112-081624abe068').subscribe({

      next: (data) => {
        this.quiz.set(data);
        console.log('Quiz cargado:', this.quiz);
        this.isLoading.set(false)
      },
      error: (err) => {
        this.isLoading.set(false)

        console.error('Error al cargar el quiz', err);
      }
    });

    this.quizNavService.setTotalQuestions(this.quiz().questions.length);
    // En lugar de modificar el array directamente:
    this.quiz.update(currentQuiz => ({
      ...currentQuiz,
      questions: currentQuiz.questions.map(question => ({
        ...question,
        answers: question.answers.map(answer => ({
          ...answer,
          isSelected: false,
          isCorrectOption: false
        }))
      }))
    }));
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
    const currentQuestionId = this.quiz().questions[this.quizNavService.currentPosition()].id;
    // Buscamos si existe una respuesta para este ID y si tiene al menos un ID de respuesta seleccionado
    return this.userAnswers().some(a => a.questionId === currentQuestionId && a.answerIds.length > 0);
  }


  evaluateQuiz() {
    const currentQuiz = this.quiz();
    if (!currentQuiz) return;

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
        console.log(`Puntaje obtenido: ${result.score} de ${result.totalQuestions}`);
        console.log(`Tu porcentaje es: ${result.percentage}%`);

        // Aquí puedes navegar a una página de resultados 
        // o mostrar el feedback en el mismo componente:
        result.review.forEach(item => {
          console.log(`Pregunta: ${item.question}, ¿Correcta?: ${item.isCorrect}`);
        });
      },
      error: (err) => {
        console.error('Error al evaluar:', err);
      }
    });
  }

}
