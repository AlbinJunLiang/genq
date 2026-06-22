import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environments";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { CreateQuestionDto, QuestionListResponse, QuestionResponse, UpdateQuestionDto } from "../../interfaces/question-interface";
import { catchError, Observable, throwError } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class QuestionService {

    private readonly apiUrl = environment.apiUrl + '/questions';
    private http = inject(HttpClient);


    createQuestion(questionData: CreateQuestionDto): Observable<QuestionResponse> {
        return this.http.post<QuestionResponse>(this.apiUrl, questionData).pipe(
            catchError(this.handleError)
        );
    }

    updateQuestion(questionId: number, questionData: UpdateQuestionDto): Observable<QuestionResponse> {
        return this.http.put<QuestionResponse>(`${this.apiUrl}/${questionId}`, questionData).pipe(
            catchError(this.handleError)
        );
    }


    readQuestionsByQuizId(quizId: number): Observable<QuestionListResponse> {
        return this.http.get<QuestionListResponse>(`${this.apiUrl}/${quizId}/answers`).pipe(
            catchError(this.handleError)
        );
    }

    deleteQuestion(id: number | string): Observable<void> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.delete<void>(url).pipe(
            catchError(this.handleError)
        );
    }


    private handleError(error: HttpErrorResponse) {
        return throwError(() => error);
    }

}