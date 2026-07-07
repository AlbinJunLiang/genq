import { inject, Injectable, signal, computed } from "@angular/core";
import { catchError, finalize, tap, throwError } from "rxjs";
import { AttemptService } from "../services/api/attempt-service";
import { QuizAttemptResponse } from "../interfaces/attempt-interface";


@Injectable({ providedIn: 'root' })
export class AttemptStore {
    private service = inject(AttemptService);

    private _attempts = signal<QuizAttemptResponse[]>([]);
    private _loading = signal<boolean>(false);
    private _error = signal<string | null>(null);

    readonly attempts = this._attempts.asReadonly();
    readonly loading = this._loading.asReadonly();
    readonly error = this._error.asReadonly();
    readonly isEmpty = computed(() => this._attempts().length === 0);

    public _limit = signal(10);


    private _total = signal<number>(0);

    public total = computed(() => this._total())


    private _currentPage = signal(1);
    public currentPage = computed(() => this._currentPage());


    public totalPages = computed(() => Math.ceil(this._total() / this._limit()));



    public loadAttempts(page: number = 1, limit: number = 10) {
        this._loading.set(true);
        this._error.set(null);

        this.service.getMyAttempts(page, limit)
            .pipe(
                finalize(() => this._loading.set(false)),
                catchError(err => {
                    this._error.set("Cannot load the attempts.");
                    return throwError(() => err);
                })
            )
            .subscribe(res => {
                this._total.set(res.pagination.total);
                this._currentPage.set(page);
                this._attempts.set(res.attempts);
            });
    }

    public deleteATtempt(id: number) {
        this._loading.set(true);
        return this.service.deleteAttempt(id).pipe(
            tap(() => {
                this._attempts.update(prev => prev.filter(a => a.id !== id));
            }),
            finalize(() => this._loading.set(false)),
            catchError(err => {
                this._error.set("Cannot delete the attempt.");
                return throwError(() => err);
            })
        );
    }
}