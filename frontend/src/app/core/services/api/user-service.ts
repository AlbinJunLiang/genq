import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { of } from 'rxjs';
import { environment } from "../../../../environments/environments";
import { UserPaginationResponse } from "../../interfaces/offset-pagination-interface";
import { User, UserResponse, UserUpdate } from "../../interfaces/user-interface";
import { MOCK_USERS } from "../mocks/user-mock";
import { MOCK_USER_RESPONSE } from "../mocks/user-response-mock";

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private readonly apiUrl = environment.apiUrl;
    private http = inject(HttpClient);
    private mock = MOCK_USERS;


    authUser(): Observable<UserResponse> {

        if (environment.mockeable) {
            return of(MOCK_USER_RESPONSE);
        }

        return this.http.post<UserResponse>(`${this.apiUrl}/users/auth`, {})
            .pipe(
                catchError((err) => {
                    return throwError(() => err);
                })
            );
    }

    public getUsers(page: number = 1, limit: number = 5): Observable<UserPaginationResponse> {
        if (environment.mockeable) {
            const currentPage = Math.max(1, page);
            const startIndex = (currentPage - 1) * limit;
            const endIndex = startIndex + limit;

            const response: UserPaginationResponse = {
                sucess: true,
                data: this.mock.slice(startIndex, endIndex),
                pagination: {
                    total: this.mock.length,
                    page: currentPage,
                    limit: limit,
                    totalPages: Math.ceil(this.mock.length / limit)
                }
            };

            return of(response);
        }
        return this.http.get<UserPaginationResponse>(`${this.apiUrl}/users?page=${page}&limit=${limit}`
        );
    }


    public updateUser(id: number, updatedUser: UserUpdate): Observable<User> {
        if (environment.mockeable) {
            const index = this.mock.findIndex(m => m.id === id);

            if (index === -1) {
                return throwError(() => new Error('Usuario no encontrado en mocks'));
            }
            const updatedMockup: User = {
                ...this.mock[index],
                ...updatedUser
            };

            this.mock[index] = updatedMockup;
            return of(updatedMockup);
        }

        return this.http.put<User>(`${this.apiUrl}/users/${id}`, updatedUser);
    }

}