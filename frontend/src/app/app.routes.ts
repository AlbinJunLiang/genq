import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { QuizView } from './features/quiz-view/quiz-view';
import { QuizContainer } from './features/quiz-container/quiz-container';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'quizzes', component: QuizView },
    { path: 'home', redirectTo: '', pathMatch: 'full' },
    { path: 'quiz/:quizId', component: QuizContainer },


    // Ruta comodín (siempre debe ir al final)
    { path: '**', redirectTo: '', pathMatch: 'full' }
];