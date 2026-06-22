import { effect, inject, Injectable, signal } from '@angular/core';
import { ConfigService } from './config-service';
import { translations } from '../../../shared/i8n/translation';

type Lang = keyof typeof translations;

export type TranslationKey =
    keyof typeof translations.es;


@Injectable({
    providedIn: 'root'
})
export class LanguageService {

    private configService = inject(ConfigService);
    public onLanguageChanged?: () => void;


    currentLang = signal<Lang>('en');

    constructor() {
        effect(() => {
            this.currentLang.set(
                this.configService.translation()
            );
        });
    }

    translate(key: TranslationKey): string {
        return translations[this.currentLang()][key];
    }

    changeLang(lang: Lang) {
        this.configService.translation.set(lang);
        this.onLanguageChanged?.();
    }
}