// admin.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthUserStore } from '../stores/auth-user-store';

export const adminGuard: CanActivateFn = (route, state) => {
    const authUserStore = inject(AuthUserStore);
    const router = inject(Router);

    if (authUserStore.userSyncData()?.user.role === 'ADMIN') {
        return true;
    }

    router.navigate(['/']);
    return false;
};