import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SearchService {
    // Estado privado del buscador
    private _query = signal('');

    // Lo que los componentes ven (solo lectura)
    public query = this._query.asReadonly();

    private _isSearching = signal(false);
    isSearching = this._isSearching.asReadonly(); // Solo lectura para componentes

    // Método para activar/desactivar
    setSearching(status: boolean) {
        this._isSearching.set(status);
    }
    // Método para actualizar
    updateQuery(val: string) {
        this._query.set(val);
    }

    // Método para limpiar (detecta que el usuario quiere borrar)
    clear() {
        this._query.set('');
    }
}