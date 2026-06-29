import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, from, map, Observable, of, throwError } from 'rxjs';
import { CreateQuizDto, EvaluationRequest, Quiz, QuizApiResponse, QuizCreateResponse, QuizDetail, QuizListResponse, UpdateQuizDto } from '../../interfaces/quiz-interface';
import { environment } from '../../../../environments/environments';
import { generateRandomString } from '../../../shared/util/random-string';
import { MOCK_USER_RESPONSE } from '../mocks/user-response-mock';
import { EvaluationResult } from '../../interfaces/quiz-review-interface';
import { INITIAL_QUIZ_MOCK } from '../mocks/quiz-start-mock';


@Injectable({
    providedIn: 'root'
})
export class QuizService {
    private readonly apiUrl = environment.apiUrl + '/quizzes';
    private http = inject(HttpClient);
    private mock: Quiz[] | null = null;


    private async initMock() {
        const { MOCK_QUIZZES } = await import('../mocks/quiz-mock');
        this.mock = MOCK_QUIZZES;
    }

    private async loadMocks(): Promise<Quiz[]> {
        if (!this.mock) {
            const { MOCK_QUIZZES } = await import('../mocks/quiz-mock');
            this.mock = MOCK_QUIZZES;
        }
        return this.mock!;
    }

    private paginateData<T>(allData: T[], page: number, limit: number) {
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        return {
            data: allData.slice(startIndex, endIndex),
            pagination: {
                total: allData.length,
                page: page,
                limit: limit,
                totalPages: Math.ceil(allData.length / limit)
            }
        };
    }

    createQuiz(quizData: CreateQuizDto): Observable<QuizCreateResponse> {
        if (environment.mockeable && this.mock != null) {
            this.initMock();
            const mockup: QuizCreateResponse =
            {
                message: 'It is a Mockup',
                quiz: {
                    uuid: generateRandomString(),
                    id: Math.floor(Math.random() * 100),
                    title: quizData.title,
                    description: quizData.description,
                    visibility: quizData.visibility,
                    endAt: quizData.endAt,
                    durationSeconds: quizData.durationSeconds, // 30 minutos
                    attemptsLimit: quizData.attemptsLimit,
                    userId: MOCK_USER_RESPONSE.user.id,
                    createdAt: '2026-06-01T10:00:00Z'
                }
            };
            this.mock.push(mockup.quiz);
            return of(mockup);
        }
        return this.http.post<QuizCreateResponse>(this.apiUrl, quizData).pipe(
            catchError(this.handleError)
        );
    }

    getMyQuizzes(
        page: number = 1,
        limit: number = 8,
        visibility: string = 'ALL'
    ): Observable<QuizListResponse> {

        if (environment.mockeable) {
            return from(this.loadMocks()).pipe(
                map((allMocks) => {
                    // Filtramos primero si viene el parámetro de visibilidad
                    let data = allMocks;
                    if (visibility && visibility !== 'ALL') {
                        data = data.filter(q => q.visibility === visibility);
                    }

                    const startIndex = (page - 1) * limit;
                    const endIndex = startIndex + limit;

                    return {
                        data: data.slice(startIndex, endIndex),
                        pagination: {
                            total: data.length,
                            page: page,
                            limit: limit,
                            totalPages: Math.ceil(data.length / limit)
                        }
                    };
                })
            );
        }
        let params = new HttpParams()
            .set('page', page.toString())
            .set('limit', limit.toString());

        // Solo añadimos el filtro si existe
        if (visibility && visibility !== 'ALL') {
            params = params.set('visibility', visibility);
        }

        return this.http.get<QuizListResponse>(this.apiUrl + '/me', { params });
    }


    getQuizzes(page: number = 1, limit: number = 8): Observable<QuizListResponse> {
        if (environment.mockeable) {
            return from(this.loadMocks()).pipe(
                map((allMocks) => {
                    const startIndex = (page - 1) * limit;
                    const endIndex = startIndex + limit;
                    return {
                        data: allMocks.slice(startIndex, endIndex),
                        pagination: {
                            total: allMocks.length,
                            page: page,
                            limit: limit,
                            totalPages: Math.ceil(allMocks.length / limit)
                        }
                    };
                })
            );
        }
        const params = new HttpParams()
            .set('page', page.toString())
            .set('limit', limit.toString());

        return this.http.get<QuizListResponse>(this.apiUrl, { params });
    }




    searchQuizzes(page: number = 1, limit: number = 8, query: string = ''): Observable<QuizListResponse> {
        if (environment.mockeable) {
            return from(this.loadMocks()).pipe(
                map((allMocks) => {
                    // 1. Filtrar por el contenido (título o descripción)
                    const filtered = allMocks.filter(q =>
                        q.title.toLowerCase().includes(query.toLowerCase()) ||
                        q.description?.toLowerCase().includes(query.toLowerCase())
                    );

                    // 2. Reutilizar la lógica de paginación con los datos filtrados
                    return this.paginateData(filtered, page, limit);
                })
            );
        }

        const params = new HttpParams()
            .set('page', page.toString())
            .set('q', query)
            .set('limit', limit.toString());

        return this.http.get<QuizListResponse>(this.apiUrl + "/search", { params });
    }

    /**
     * Actualiza un quiz existente
     * @param id ID del quiz a actualizar
     * @param quizData Datos a modificar
     */
    updateQuiz(id: number | string, quizData: UpdateQuizDto): Observable<QuizCreateResponse> {
        const url = `${this.apiUrl}/${id}`;

        if (environment.mockeable) {
            return from(this.loadMocks()).pipe(
                map(allMocks => {
                    // Buscamos el índice del quiz a actualizar
                    const index = allMocks.findIndex(q => q.id === Number(id));
                    if (index === -1) throw new Error('Quiz not found');

                    // Combinamos el quiz existente con los nuevos datos
                    const updatedQuiz = { ...allMocks[index], ...quizData };
                    allMocks[index] = updatedQuiz;

                    return { message: 'Updated successfully', quiz: updatedQuiz };
                })
            );
        }

        return this.http.put<QuizCreateResponse>(url, quizData).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Elimina un quiz por su ID
     * @param id ID del quiz a eliminar
     */
    deleteQuiz(id: number | string): Observable<void> {
        const url = `${this.apiUrl}/${id}`;

        if (environment.mockeable) {
            return from(this.loadMocks()).pipe(
                map(allMocks => {
                    // Filtramos el array para eliminar el elemento
                    const index = allMocks.findIndex(q => q.id === Number(id));
                    if (index !== -1) {
                        allMocks.splice(index, 1);
                    }
                    return; // Retornamos void
                })
            );
        }

        return this.http.delete<void>(url).pipe(
            catchError(this.handleError)
        );
    }


    startQuizByUuid(uuid: string): Observable<QuizDetail> {
        if (environment.mockeable) {
            return of(INITIAL_QUIZ_MOCK);
        }
        return this.http.post<QuizApiResponse>(`${this.apiUrl}/uuid/${uuid}`,{}).pipe(
            map(response => response.quiz), // ¡Aquí extraes el quiz y olvidas el envoltorio!
            catchError(this.handleError)
        );
    }
    // En tu quiz-service.ts
    evaluateQuiz(uuid: string, payload: EvaluationRequest): Observable<EvaluationResult> {
        return this.http.post<EvaluationResult>(`${this.apiUrl}/evaluate/${uuid}`, payload).pipe(
            catchError(this.handleError)
        );
    }


    private handleError(error: HttpErrorResponse) {
        return throwError(() => error);
    }
}