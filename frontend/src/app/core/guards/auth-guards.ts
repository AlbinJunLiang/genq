import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth/auth-service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verifica si el usuario está logueado
  if (authService.isLoggedIn()) {
    return true;
  } else {
    // Si no, redirige a la ruta de login y bloquea el acceso
    router.navigate(['/login']);
    return false;
  }
};