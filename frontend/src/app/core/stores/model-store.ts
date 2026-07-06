import { Injectable, signal, inject } from '@angular/core';
import { ModelService } from '../services/api/model-service';
import { ModelResponse } from '../interfaces/model-interface'; // Asegúrate de usar la interfaz correcta
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ModelStore {
    private modelService = inject(ModelService);

    // Estados
    private _models = signal<ModelResponse[]>([]);
    private _loading = signal(false);
    private _total = signal(0);

    // Getters públicos (Readonly)
    public models = this._models.asReadonly();
    public isLoading = this._loading.asReadonly();
    public total = this._total.asReadonly();

    // Cargar modelos
    loadModels() {
        if (this._loading()) return;
        this._loading.set(true);

        this.modelService.getModels().subscribe({
            next: (data) => {
                this._models.set(data);
                this._total.set(data.length);
                this._loading.set(false);
            },
            error: () => this._loading.set(false)
        });
    }

    // Crear modelo
    public createModel(newModel: { model: string, provider: string }): Observable<ModelResponse> {
        this._loading.set(true);
        return this.modelService.createModel(newModel).pipe(
            tap((response) => {
                this._models.update(list => [...list, response]);
                this._total.set(this._models().length);
                this._loading.set(false);
            }),
            catchError((err) => {
                this._loading.set(false);
                return throwError(() => err);
            })
        );
    }

    // Actualizar modelo
    public updateModel(id: number, updatedModel: { model: string, provider: string }): Observable<ModelResponse> {
        this._loading.set(true);
        return this.modelService.updateModel(id, updatedModel).pipe(
            tap((response) => {
                this._models.update(list =>
                    list.map(m => (m.id === id ? response : m))
                );
                this._loading.set(false);
            }),
            catchError((err) => {
                this._loading.set(false);
                return throwError(() => err);
            })
        );
    }

    // Eliminar modelo
    public deleteModel(id: number): Observable<void> {
        this._loading.set(true);
        return this.modelService.deleteModel(id).pipe(
            tap(() => {
                this._models.update(list => list.filter(m => m.id !== id));
                this._total.set(this._models().length);
                this._loading.set(false);
            }),
            catchError((err) => {
                this._loading.set(false);
                return throwError(() => err);
            })
        );
    }
}