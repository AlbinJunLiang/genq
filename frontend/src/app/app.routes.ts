import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { QuizView } from './features/quiz-view/quiz-view';
import { QuizContainer } from './features/quiz-container/quiz-container';
import { QuizHistoryGrid } from './features/quiz-history-grid/quiz-history-grid';
import { QuizGradedContainer } from './features/quiz-graded-container/quiz-graded-container';
import { authGuard } from './core/guards/auth-guards';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'quizzes', component: QuizView },
    { path: 'history', component: QuizHistoryGrid, canActivate: [authGuard] },
    { path: 'home', redirectTo: '', pathMatch: 'full' },
    { path: 'quiz/:quizUuid', component: QuizContainer },
    { path: 'graded', component: QuizGradedContainer, canActivate: [authGuard] },
    // Ruta comodín (siempre debe ir al final)
    { path: '**', redirectTo: '', pathMatch: 'full' }
];