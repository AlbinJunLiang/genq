import { Injectable, signal, OnDestroy, inject, NgZone } from '@angular/core';

interface ActiveTimer {
    targetTime: number;
    timeRemaining: number;
    intervalId: any;
}

@Injectable({
    providedIn: 'root'
})
export class CountdownService implements OnDestroy {
    private readonly STORAGE_PREFIX = 'shapper_cooldown_';

    private timers = signal<Record<string, ActiveTimer>>({});
    private ngZone = inject(NgZone);

    constructor() {
        this.restoreExistingTimers();
    }

    ngOnDestroy() {
        // Limpieza total de hilos si el servicio llega a ser destruido
        Object.values(this.timers()).forEach(t => {
            if (t.intervalId) clearInterval(t.intervalId);
        });
    }

    /**
     * Inicia o reinicia un temporizador específico
     * @param key Identificador único (ej: 'verify', 'forgot-password')
     * @param minutes Duración del bloqueo en minutos (por defecto 10)
     */
    start(key: string, minutes: number = 10) {
        const targetTime = Date.now() + minutes * 60 * 1000;
        localStorage.setItem(`${this.STORAGE_PREFIX}${key}`, targetTime.toString());

        this.runTimerLoop(key, targetTime);
    }

    /**
     * Cancela y limpia un temporizador específico de inmediato
     */
    clear(key: string) {
        localStorage.removeItem(`${this.STORAGE_PREFIX}${key}`);

        const currentTimers = { ...this.timers() };
        if (currentTimers[key]) {
            if (currentTimers[key].intervalId) clearInterval(currentTimers[key].intervalId);
            delete currentTimers[key];
            this.timers.set(currentTimers);
        }
    }

    /**
     * Verifica de forma dinámica si un temporizador específico está corriendo
     */
    isActive(key: string): boolean {
        return (this.timers()[key]?.timeRemaining ?? 0) > 0;
    }

    /**
     * Obtiene el texto formateado (MM:SS) de un temporizador específico
     */
    getLabel(key: string, defaultLabel: string = '10:00'): string {
        const diff = this.timers()[key]?.timeRemaining ?? 0;
        if (diff <= 0) return defaultLabel;

        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }


    private restoreExistingTimers() {
        // Buscamos en el localStorage todas las llaves que correspondan al prefijo
        for (let i = 0; i < localStorage.length; i++) {
            const storageKey = localStorage.key(i);
            if (storageKey && storageKey.startsWith(this.STORAGE_PREFIX)) {
                const key = storageKey.replace(this.STORAGE_PREFIX, '');
                const savedTarget = localStorage.getItem(storageKey);

                if (savedTarget) {
                    const targetTime = parseInt(savedTarget, 10);
                    if (targetTime > Date.now()) {
                        this.runTimerLoop(key, targetTime);
                    } else {
                        localStorage.removeItem(storageKey);
                    }
                }
            }
        }
    }

    private runTimerLoop(key: string, targetTime: number) {
        // Si ya existía un intervalo corriendo para este key, lo destruimos primero
        const currentTimers = { ...this.timers() };
        if (currentTimers[key]?.intervalId) {
            clearInterval(currentTimers[key].intervalId);
        }

        const initialDiff = targetTime - Date.now();

        if (initialDiff <= 0) {
            this.clear(key);
            return;
        }

        this.timers.update(prev => ({
            ...prev,
            [key]: { ...prev[key], targetTime, timeRemaining: initialDiff }
        }));

        this.ngZone.runOutsideAngular(() => {
            const update = () => {
                const diff = targetTime - Date.now();

                if (diff <= 0) {
                    this.ngZone.run(() => this.clear(key));
                    return;
                }

                this.ngZone.run(() => {
                    this.timers.update(prev => ({
                        ...prev,
                        [key]: {
                            ...prev[key],
                            targetTime,
                            timeRemaining: diff
                        }
                    }));
                });
            };

            const intervalId = setInterval(update, 1000);

            this.ngZone.run(() => {
                this.timers.update(prev => ({
                    ...prev,
                    [key]: { ...prev[key], intervalId }
                }));
            });
        });
    }
}