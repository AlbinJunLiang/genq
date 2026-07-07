import { inject, Injectable, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import {
    Auth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    authState,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
    UserCredential,
    onAuthStateChanged,
    sendEmailVerification,
    reload,
    deleteUser,
    sendPasswordResetEmail
} from '@angular/fire/auth';
import { map, from, switchMap, Observable, catchError, throwError, defer, of } from 'rxjs';
import { User } from './user-interface';
import { IAuth } from './auth-interface';

@Injectable({ providedIn: 'root' })
export class FirebaseAuthService implements IAuth {
    private auth = inject(Auth);
    private injector = inject(EnvironmentInjector);


    login(email: string, pass: string): Observable<User> {
        return defer(() =>
            runInInjectionContext(this.injector, () =>
                from(signInWithEmailAndPassword(this.auth, email, pass))
            )
        ).pipe(
            map((credential: UserCredential): User => ({
                uid: credential.user.uid,
                email: credential.user.email ?? '',
                displayName: credential.user.displayName ?? undefined
            })),
            catchError((err) => {
                console.log(err)
                return throwError(() => err);
            })
        );
    }

    loginWithProvider(): Observable<void> {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });

        return runInInjectionContext(this.injector, () => {
            return from(signInWithPopup(this.auth, provider)).pipe(
                map(() => void 0)
            );
        });
    }

    register(email: string, pass: string, displayName?: string): Observable<User> {
        return defer(() =>
            runInInjectionContext(this.injector, () =>
                from(createUserWithEmailAndPassword(this.auth, email, pass)).pipe(
                    switchMap((credential: UserCredential) => {
                        if (displayName) {
                            return from(updateProfile(credential.user, { displayName })).pipe(
                                map(() => credential)
                            );
                        }
                        return of(credential);
                    })
                )
            )
        ).pipe(
            map((credential: UserCredential): User => ({
                uid: credential.user.uid,
                email: credential.user.email ?? '',
                displayName: credential.user.displayName ?? undefined
            })),
            catchError((err) => throwError(() => err))
        );
    }

    logout(): Observable<void> {
        return defer(() =>
            runInInjectionContext(this.injector, () =>
                from(signOut(this.auth))
            )
        );
    }



    getCurrentUser(): Observable<User | null> {
        return defer(() =>
            runInInjectionContext(this.injector, () => authState(this.auth))
        ).pipe(
            map((user): User | null => user ? {
                uid: user.uid,
                email: user.email ?? '',
                displayName: user.displayName ?? undefined,
                emailVerified: user.emailVerified,
            } : null)

        );

    }


    onAuthStateChange(): Observable<User | null> {
        return new Observable<User | null>((subscriber) => {
            const unsubscribe = onAuthStateChanged(this.auth, (user) => {
                if (user) {
                    subscriber.next({
                        uid: user.uid,
                        email: user.email ?? '',
                        displayName: user.displayName ?? undefined,
                        emailVerified: user.emailVerified ?? false
                    });
                } else {
                    subscriber.next(null);
                }
            }, (error) => {
                subscriber.error(error);
            });

            return () => unsubscribe();
        });
    }


    handleRedirectResult(): Observable<User | null> {
        return of(null);
    }

    async getIdToken(): Promise<string | null> {
        const user = this.auth.currentUser;
        if (!user) return null;

        return await user.getIdToken();
    }

    sendEmailVerification(): Observable<void> {
        return defer(() => {
            const user = this.auth.currentUser;

            if (!user) {
                return throwError(() => 'No hay un usuario autenticado para verificar.');
            }

            return runInInjectionContext(this.injector, () =>
                from(sendEmailVerification(user))
            );
        }).pipe(
            catchError((err) => {
                return throwError(() => err);
            })
        );
    }

    refreshAuthStatus(): Observable<boolean> {
        const user = this.auth.currentUser;
        if (!user) return of(false);

        return defer(() => {
            const promise = runInInjectionContext(this.injector, async () => {
                await reload(user);
                await user.getIdToken(true);
                return user.emailVerified;
            });
            return from(promise);
        }).pipe(
            catchError((err) => {
                console.error('Error al refrescar estado:', err);
                return of(false);
            })
        );
    }

    sendPasswordResetEmail(email: string): Observable<void> {
        return defer(() =>
            runInInjectionContext(this.injector, () =>
                from(sendPasswordResetEmail(this.auth, email))
            )
        ).pipe(
            catchError((err) => {
                return throwError(() => err);
            })
        );
    }

    deleteAccount(): Observable<void> {
        return defer(() => {
            const user = this.auth.currentUser;
            if (!user) return throwError(() => 'No hay usuario autenticado.');

            return runInInjectionContext(this.injector, () =>
                from(deleteUser(user))
            );
        }).pipe(
            catchError((err) => {
                if (err.code === 'auth/requires-recent-login') {
                    return throwError(() => 'Re-authentication required before deleting account.');
                }
                return throwError(() => 'Error al eliminar la cuenta.');
            })
        );
    }
}