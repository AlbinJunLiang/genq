import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environments";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { AnswerResponse, CreateAnswerDto, UpdateAnswerDto } from "../../interfaces/answer-interface";
import { catchError, Observable, throwError } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class AnswerService {

    private readonly apiUrl = environment.apiUrl + '/answers';
    private http = inject(HttpClient);

    createAnswer(questionData: CreateAnswerDto): Observable<AnswerResponse> {
        return this.http.post<AnswerResponse>(this.apiUrl, questionData).pipe(
            catchError(this.handleError)
        );
    }

    updateAnswer(answerId: number, answerData: UpdateAnswerDto): Observable<AnswerResponse> {
        return this.http.put<AnswerResponse>(`${this.apiUrl}/${answerId}`, answerData).pipe(
            catchError(this.handleError)
        );
    }


    deleteAnswer(id: number | string): Observable<void> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.delete<void>(url).pipe(
            catchError(this.handleError)
        );
    }


    private handleError(error: HttpErrorResponse) {
        return throwError(() => error);
    }
}