import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environments";
import { HttpClient, HttpParams } from "@angular/common/http";
import { PaginatedAttempts, PaginatedLeaderboardAttempt } from "../../interfaces/paginated-attempts-interface";
import { Observable } from "rxjs";



@Injectable({
    providedIn: 'root'
})
export class AttemptService {

    private readonly apiUrl = environment.apiUrl + '/attempts';
    private http = inject(HttpClient);


    getMyAttempts(page: number = 1, limit: number = 10): Observable<PaginatedAttempts> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('limit', limit.toString());

        return this.http.get<PaginatedAttempts>(`${this.apiUrl}/my-attempts`, { params });
    }
    /**
     * Obtiene los intentos de un quiz específico
     * @param quizId ID del quiz
     * @param sortBy Campo de ordenamiento ('finished_at' o 'score')
     * @param order Dirección del orden ('ASC' o 'DESC')
     * @param page Número de página (opcional)
     * @param limit Cantidad de registros por página (opcional)
     */

    getAttemptsByQuiz(
        quizId: number,
        sortBy: 'finished_at' | 'score' = 'finished_at',
        order: 'ASC' | 'DESC' = 'DESC',
        page: number = 1,
        limit: number = 10
    ): Observable<PaginatedLeaderboardAttempt> {

        const params = new HttpParams()
            .set('sortBy', sortBy)
            .set('order', order)
            .set('page', page.toString())
            .set('limit', limit.toString());

        return this.http.get<PaginatedLeaderboardAttempt>(
            `${this.apiUrl}/quiz/${quizId}`,
            { params }
        );
    }
    deleteAttempt(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
    }


}