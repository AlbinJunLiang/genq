import { inject, Injectable } from '@angular/core';
import { of, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environments';
import { ModelResponse } from '../../interfaces/model-interface';
import { getRandomInt } from '../../../shared/util/random-string';


export const AVAILABLE_MODELS: ModelResponse[] = [
    { id: 1, model: 'gpt-oss-120b', provider: 'cerebras' },
    { id: 2, model: 'gemini-2.5-flash', provider: 'google' },
    { id: 3, model: 'llama-3.3-70b-versatile', provider: 'groq' },
    { id: 4, model: 'openai/gpt-oss-120b:nscale', provider: 'huggingface' },
    { id: 5, model: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning', provider: 'nvidia' },
    { id: 6, model: 'google/gemma-3-4b-it', provider: 'openrouter' }
];
@Injectable({
    providedIn: 'root',
})
export class ModelService {
    private readonly apiUrl = environment.apiUrl + '/models';
    private http = inject(HttpClient);
    private mock: ModelResponse[] = AVAILABLE_MODELS


    public getModels(): Observable<ModelResponse[]> {
        if (environment.mockeable) {
            return of(AVAILABLE_MODELS);
        }
        return this.http.get<ModelResponse[]>(`${this.apiUrl}`
        );
    }


    public createModel(newModel: { model: string, provider: string }): Observable<ModelResponse> {
        if (environment.mockeable) {
            const mockup: ModelResponse = {
                id: getRandomInt(),
                model: newModel.model,
                provider: newModel.provider
            };
            this.mock.push(mockup);
            return of(mockup);
        }

        return this.http.post<ModelResponse>(this.apiUrl, newModel);
    }


    public updateModel(id: number, updatedModel: { model: string, provider: string }): Observable<ModelResponse> {
        if (environment.mockeable) {
            // Buscamos el índice del elemento en nuestro array mock
            const index = this.mock.findIndex(m => m.id === id);

            if (index === -1) {
                return throwError(() => new Error('Modelo no encontrado en mocks'));
            }
            const updatedMockup: ModelResponse = {
                ...this.mock[index],
                ...updatedModel
            };

            this.mock[index] = updatedMockup;
            return of(updatedMockup);
        }

        // Petición real al servidor (PUT)
        return this.http.put<ModelResponse>(`${this.apiUrl}/${id}`, updatedModel);
    }


    public deleteModel(id: number): Observable<void> {
        if (environment.mockeable) {
            // Buscamos el índice y lo eliminamos del array local
            const index = this.mock.findIndex(m => m.id === id);
            if (index !== -1) {
                this.mock.splice(index, 1);
            }
            return of(undefined);
        }
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

}