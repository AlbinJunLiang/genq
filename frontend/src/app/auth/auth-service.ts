// auth.service.ts
import { inject, Injectable, computed, signal, OnDestroy } from '@angular/core';

import { catchError, from, map, Observable, of, Subscription, switchMap, throwError } from 'rxjs';
import { User } from './user-interface';
import { FirebaseAuthService } from './firebase-auth-interface';


@Injectable({
    providedIn: 'root'
})

export class AuthService implements OnDestroy {
    private provider = inject(FirebaseAuthService);

    private _user = signal<User | null>(null);
    private _initializing = signal<boolean>(true);
    private authSubscription: Subscription | null = null;

    public user = computed(() => this._user());
    public isLoggedIn = computed(() => !!this._user());
    public isInitializing = computed(() => this._initializing());

    private _token = signal<string | null>(null);
    public token = computed(() => this._token());
    public isEmailVerified = computed(() => this._user()?.emailVerified ?? false);

    constructor() {
        this.authSubscription = this.provider.onAuthStateChange().subscribe({
            next: async (user) => {
                this._user.set(user);

                if (user) {
                    const token = await this.provider.getIdToken();
                    this._token.set(token);
                } else {
                    this._token.set(null);
                }

                this._initializing.set(false);
            }
        });
    }

    ngOnDestroy() {
        this.authSubscription?.unsubscribe();
    }

    loginWithProvider(): Observable<void> {
        return this.provider.loginWithProvider();
    }

    register(email: string, pass: string, name: string) {
        return this.provider.register(email, pass, name);
    }

    login(email: string, pass: string) {
        return this.provider.login(email, pass);
    }

    logout() {
        return this.provider.logout();
    }

    async getTokenAsync(): Promise<string | null> {
        const user = this._user();
        if (!user) return null;
        return await this.provider.getIdToken();
    }

    sendEmailVerification(): Observable<void> {
        return this.provider.sendEmailVerification().pipe(
            catchError((err) => {
                return throwError(() => err);
            })
        );
    }

    refreshAuthStatus(): Observable<boolean> {
        return this.provider.refreshAuthStatus().pipe(
            switchMap((isVerified) => {
                // 1. Si el usuario está verificado, manejamos el token con RxJS puro
                if (isVerified) {
                    // 'from' convierte la promesa de tu proveedor en un flujo reactivo limpio
                    return from(this.provider.getIdToken()).pipe(
                        map((newToken) => {
                            this._token.set(newToken);
                            return true; // Retornamos el valor de isVerified (que es true)
                        })
                    );
                }

                // 2. Si no está verificado, simplemente dejamos pasar el 'false' envuelto en un observable
                return of(false);
            }),
            catchError((err) => {
                console.error('Error en el refresh del servicio:', err);
                return throwError(() => err);
            })
        );
    }

    sendPasswordResetEmail(email: string): Observable<void> {
        return this.provider.sendPasswordResetEmail(email);
    }

    deleteAccount(): Observable<void> {
        return this.provider.deleteAccount();
    }

    public updateDisplayName(newName: string) {
        this._user.update(currentUser => {
            if (!currentUser) return null;
            const updatedUser = { ...currentUser, displayName: newName };
            return updatedUser;
        });
    }
}