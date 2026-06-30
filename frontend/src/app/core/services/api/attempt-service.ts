import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environments";
import { HttpClient, HttpParams } from "@angular/common/http";
import { PaginatedAttempts } from "../../interfaces/paginated-attempts-interface";
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


    deleteAttempt(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
    }


}