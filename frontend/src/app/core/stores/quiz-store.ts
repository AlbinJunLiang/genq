import { computed, inject, Injectable, signal } from "@angular/core";
import { FullQuiz, Quiz } from "../interfaces/quiz-interface";
import { QuizService } from "../services/api/quiz-service";
import { catchError, tap, throwError } from "rxjs";
import { CreateQuizDto, UpdateQuizDto } from "../types/quiz-types";

@Injectable({ providedIn: 'root' })
export class QuizStore {
    private quizService = inject(QuizService);

    private _quizzes = signal<Quiz[]>([]);
    private _loading = signal<boolean>(false);
    private _total = signal<number>(0);
    private _currentPage = signal(1);
    private _limit = signal(8);

    public quizzes = computed(() => this._quizzes());
    public isLoading = computed(() => this._loading());
    public total = computed(() => this._total());

    public currentPage = computed(() => this._currentPage());
    public totalPages = computed(() => Math.ceil(this._total() / this._limit()));

    public loadMyQuizzes(page: number = 1, limit: number = 8, visibility: string = 'ALL') {
        this._loading.set(true);
        this.quizService.getMyQuizzes(page, limit, visibility).subscribe({
            next: (res) => {
                this._quizzes.set(res.data);
                this._total.set(res.pagination.total);
                this._currentPage.set(page);
                this._loading.set(false);
            },
            error: () => this._loading.set(false)
        });
    }


    public loadQuizzes(page: number = 1, limit: number = 8) {
        this._loading.set(true);
        this.quizService.getQuizzes(page, limit).subscribe({
            next: (res) => {
                this._quizzes.set(res.data);
                this._total.set(res.pagination.total);
                this._currentPage.set(page);
                this._loading.set(false);
            },
            error: () => this._loading.set(false)
        });
    }



    public searchQuizzes(page: number = 1, limit: number = 8, query: string = '') {
        this._loading.set(true);
        this.quizService.searchQuizzes(page, limit, query).subscribe({
            next: (res) => {
                this._quizzes.set(res.data);
                this._total.set(res.pagination.total);
                this._currentPage.set(page);
                this._loading.set(false);
            },
            error: () => this._loading.set(false)
        });
    }

    // Crear un nuevo quiz (lo inserta al inicio)
    public create(dto: CreateQuizDto) {
        this._loading.set(true);
        return this.quizService.createQuiz(dto).pipe(
            tap((res) => {
                this._quizzes.update(current => [res.quiz, ...current].slice(0, 8));

                this._total.update(t => t + 1);

                this._loading.set(false);
            }),
            catchError((err) => {
                this._loading.set(false);
                return throwError(() => err);
            })
        );
    }

    public createFullQuiz(quizData: FullQuiz) {
        this._loading.set(true);
        return this.quizService.createFullQuiz(quizData).pipe(
            tap((res) => {
                this._quizzes.update(current => [res.quiz, ...current].slice(0, 8));

                this._total.update(t => t + 1);

                this._loading.set(false);
            }),
            catchError((err) => {
                this._loading.set(false);
                return throwError(() => err);
            })
        );
    }


    public generateQuiz(content: string, model: string, provider: string, language: string = 'Español') {
        this._loading.set(true);
        return this.quizService.generateQuiz(content, model, provider, language).pipe(
            tap((res) => {
                this._quizzes.update(current => [res.quiz, ...current].slice(0, 8));
                this._total.update(t => t + 1);
                this._loading.set(false);
            }),
            catchError((err) => {
                this._loading.set(false);
                return throwError(() => err);
            })
        );
    }


    // Actualizar quiz y reposicionar al inicio
    public update(id: number, dto: UpdateQuizDto) {
        return this.quizService.updateQuiz(id, dto).pipe(
            tap((res) => {
                this._quizzes.update(current => [
                    res.quiz,
                    ...current.filter(q => q.id !== id)
                ]);
            })
        );
    }

    // Eliminar quiz
    public remove(id: number) {
        return this.quizService.deleteQuiz(id).pipe(
            tap(() => {
                this._quizzes.update(current => current.filter(q => q.id !== id));
                this._total.update(t => Math.max(0, t - 1));
            })
        );
    }

    public clearState() {
        this._quizzes.set([]);
        this._total.set(0);
        this._currentPage.set(1);
        this._loading.set(false);
    }
}