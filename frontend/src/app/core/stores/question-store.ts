import { inject, Injectable, signal, computed } from "@angular/core";
import { catchError, finalize, tap, throwError } from "rxjs";
import { QuestionService } from "../services/api/question-service";
import { CreateQuestionDto, Question, UpdateQuestionDto } from "../interfaces/question-interface";
import { AnswerResponse } from "../interfaces/answer-interface";

@Injectable({ providedIn: 'root' })
export class QuestionStore {
  private service = inject(QuestionService);

  private _questions = signal<Question[]>([]);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  readonly questions = this._questions.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly isEmpty = computed(() => this._questions().length === 0);
  readonly getQuestionById = (id: number) =>
    computed(() => this._questions().find(q => q.id === id));

  readonly findByContent = (searchTerm: string) =>
    computed(() => {
      const term = searchTerm.toLowerCase();
      return this._questions().filter(q =>
        q.content.toLowerCase().includes(term)
      );
    });


  load(quizId: number) {
    this._loading.set(true);
    this.service.readQuestionsByQuizId(quizId)
      .pipe(
        finalize(() => this._loading.set(false)),
        catchError(err => {
          this._error.set("Cannot load the questions.");
          return throwError(() => err);
        })
      )
      .subscribe(res => {
        console.log(res)
        this._questions.set(res.questions)
      });
  }

  create(dto: CreateQuestionDto) {
    this._loading.set(true);
    return this.service.createQuestion(dto).pipe(
      tap(newQ => this._questions.update(prev => [...prev, newQ as any])),
      finalize(() => this._loading.set(false))
    );
  }

  update(id: number, dto: UpdateQuestionDto) {
    return this.service.updateQuestion(id, dto).pipe(
      tap(updatedQ => {
        this._questions.update(prev =>
          prev.map(q => q.id === id ? { ...q, ...updatedQ } : q)
        );
      })
    );
  }

  delete(id: number) {
    return this.service.deleteQuestion(id).pipe(
      tap(() => this._questions.update(prev => prev.filter(q => q.id !== id)))
    );
  }

  addAnswer(questionId: number, newAnswer: AnswerResponse) {
    this._questions.update(prev =>
      prev.map(q => q.id === questionId
        ? { ...q, answers: [...(q.answers || []), newAnswer] }
        : q
      )
    );
  }

  updateAnswer(questionId: number, answerId: number, updatedAnswer: AnswerResponse) {
    this._questions.update(prev =>
      prev.map(q => q.id === questionId ? {
        ...q,
        answers: q.answers?.map(a => a.id === answerId ? { ...a, ...updatedAnswer } : a)
      } : q)
    );
  }


  deleteAnswer(questionId: number, answerId: number) {
    this._questions.update(prev =>
      prev.map(q => q.id === questionId ? {
        ...q,
        answers: q.answers?.filter(a => a.id !== answerId)
      } : q)
    );
  }
}