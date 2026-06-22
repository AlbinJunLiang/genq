import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { QuizView } from './features/quiz-view/quiz-view';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'quizzes', component: QuizView },
    { path: 'home', redirectTo: '', pathMatch: 'full' },
    
    // Ruta comodín (siempre debe ir al final)
    { path: '**', redirectTo: '', pathMatch: 'full' }
];