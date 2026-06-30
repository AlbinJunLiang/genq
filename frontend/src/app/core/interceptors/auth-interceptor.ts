import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth, idToken } from '@angular/fire/auth';
import { switchMap, take } from 'rxjs/operators';
import { environment } from '../../../environments/environments';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const auth = inject(Auth);
    const apiUrl = environment.apiUrl;

    // Aquí defines con precisión qué rutas y métodos sí necesitan JWT
    const protectedRoutes = [

        {
            path: '/users/auth',
            methods: ['POST']
        },
        {
            path: '/users',
            methods: ['GET', 'DELETE', 'PUT']
        },
        {
            path: '/quizzes',
            methods: ['PUT', 'POST', 'DELETE']
        },
        {
            path: '/quizzes/me',
            methods: ['GET']
        },
        {
            path: '/quizzes/uuid',
            methods: ['GET']
        },
        {
            path: '/quizzes/evaluate',
            methods: ['ṔOST']
        },
        {
            path: '/questions',
            methods: ['PUT', 'POST', 'GET', 'DELETE']
        },
        {
            path: '/answers',
            methods: ['DELETE', 'POST', 'PUT']
        },

        {
            path: '/attempts',
            methods: ['DELETE', 'POST', 'GET']
        }
    ];

    // Verificamos si la petición actual coincide con tus reglas
    const isProtected = protectedRoutes.some(route => {
        const validPath = req.url.includes(apiUrl + route.path);
        const validMethod = route.methods.includes(req.method.toUpperCase());
        return validPath && validMethod;
    });

    if (!isProtected) {
        return next(req);
    }

    return idToken(auth).pipe(
        take(1), // Nos aseguramos de obtener solo el estado actual/inmediato y desuscribirnos
        switchMap(token => {
            // Si hay un token activo, clonamos la petición y lo inyectamos
            if (token) {
                const clonedRequest = req.clone({
                    setHeaders: {
                        Authorization: `Bearer ${token}`
                    }
                });
                return next(clonedRequest);
            }

            // Si el usuario no está autenticado (token es null), la petición sigue sin token
            return next(req);
        })
    );
};