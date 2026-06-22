import { computed, inject, Injectable, Injector, runInInjectionContext, signal } from "@angular/core";
import { AuthService } from "../../auth/auth-service";
import { UserService } from "../services/api/user-service";
import { toObservable } from "@angular/core/rxjs-interop";
import { UserResponse } from "../interfaces/user-interface";

@Injectable({ providedIn: 'root' })
export class AuthUserStore {
    private userService = inject(UserService);
    private authService = inject(AuthService);
    private injector = inject(Injector);

    private _isLoading = signal<boolean>(false);
    public isLoading = this._isLoading.asReadonly();

    private _userSyncData = signal<UserResponse | null>(null);
    public userSyncData = computed(() => this._userSyncData());



    initSync() {
        runInInjectionContext(this.injector, () => {
            toObservable(this.authService.user).subscribe(user => {
                if (!user) {
                    this.clearUserData();
                    return;
                }
                this.userService.authUser()
                    .subscribe({
                        next: (resp) => {
                            this._userSyncData.set(resp);
                        },
                        error: (err) => console.error('Error en Store Sync:', err)
                    });
            });
        });
    }

    private clearUserData() {
        this._userSyncData.set(null);
    }

    public getUserName() {
        const user = this.userSyncData()?.user;
        if (!user) return '';
        const name = user.name ?? '';
        return `${name}`.trim();
    }
}