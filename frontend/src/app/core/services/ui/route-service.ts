import { inject, Injectable } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { NavigationEnd, Router } from "@angular/router";
import { filter, map, startWith } from "rxjs";

@Injectable({ providedIn: 'root' })
export class RouteService {
    private router = inject(Router);

    // La señal con la URL actual
    public currentUrl = toSignal(
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            map((event: any) => event.urlAfterRedirects),
            startWith(this.router.url)
        ),
        { initialValue: this.router.url }
    );

    public isRoute(route: string): boolean {
        return this.currentUrl().includes(route);
    }
}