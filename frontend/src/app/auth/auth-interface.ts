import { Observable } from 'rxjs';
import { User } from './user-interface';

export interface IAuth {
    login(email: string, pass: string): Observable<User>;
    loginWithProvider(): Observable<void>;
    register(email: string, pass: string, displayName?: string): Observable<User>;
    logout(): Observable<void>;
    getCurrentUser(): Observable<User | null>;
    onAuthStateChange(): Observable<User | null>;
    handleRedirectResult(): Observable<User | null>;
    getIdToken(): Promise<string | null>;
    sendEmailVerification(): Observable<void>;
    refreshAuthStatus(): Observable<boolean>;
    sendPasswordResetEmail(email: string): Observable<void>;
    deleteAccount(): Observable<void>;
}