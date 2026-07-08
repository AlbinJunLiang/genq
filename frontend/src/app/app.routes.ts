import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { QuizView } from './features/quiz-view/quiz-view';
import { QuizContainer } from './features/quiz-container/quiz-container';
import { QuizHistoryGrid } from './features/quiz-history-grid/quiz-history-grid';
import { QuizGradedContainer } from './features/quiz-graded-container/quiz-graded-container';
import { authGuard } from './core/guards/auth-guards';
import { ModelTable } from './features/model-table/model-table';
import { adminGuard } from './core/guards/admin-guards';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'quizzes', component: QuizView },
    { path: 'history', component: QuizHistoryGrid, canActivate: [authGuard] },
    { path: 'home', redirectTo: '', pathMatch: 'full' },
    { path: 'quiz/:quizUuid', component: QuizContainer },
    { path: 'graded', component: QuizGradedContainer, canActivate: [authGuard] },
    { path: 'models', component: ModelTable, canActivate: [adminGuard] },
    {
        path: 'support',
        loadComponent: () => import('./features/support-section/support-section').then(m => m.SupportSection)
    },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];