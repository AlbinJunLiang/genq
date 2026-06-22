import { computed, effect, Injectable, signal } from "@angular/core";
import { ModelConfig } from "../../interfaces/model-config-interface";
import { Language } from "../../types/language-type";
import { Voice } from "../../types/voice-type";

export const AVAILABLE_MODELS: ModelConfig[] = [
    { id: '1', model: 'gpt-oss-120b', provider: 'cerebras' },
    { id: '2', model: 'gemini-2.5-flash', provider: 'google' },
    { id: '3', model: 'llama-3.3-70b-versatile', provider: 'groq' },
    { id: '4', model: 'openai/gpt-oss-120b:nscale', provider: 'huggingface' },
    { id: '5', model: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning', provider: 'nvidia' },
    { id: '6', model: 'google/gemma-3-4b-it', provider: 'openrouter' }
];

@Injectable({ providedIn: 'root' })
export class ConfigService {
    private readonly voiceKey = 'app_config';
    private readonly translationKey = 'app_translation_sweet_onion_key';
    private readonly textToSpeechKey = 'app_tts_sweet_onion_key';
    private readonly modelKey = 'app_model_sweet_onion_key';

    private getSafe<T>(key: string, defaultValue: T): T {
        const item = localStorage.getItem(key);
        try {
            return item ? JSON.parse(item) : defaultValue;
        } catch {
            return defaultValue;
        }
    }

    public voice = signal<Voice>(this.getSafe(this.voiceKey, 'NATIVE' as Voice));
    public translation = signal<Language>(this.getSavedLanguage());
    public isTextToSpeechActive = signal<boolean>(this.getSafe(this.textToSpeechKey, true));
    public model = signal<ModelConfig>(this.getSafe(this.modelKey, AVAILABLE_MODELS[0]));

    public recognitionLang = computed(() => {
        return this.translation() === 'en' ? 'en-US' : 'es-ES';
    });


    constructor() {
        effect(() => {
            localStorage.setItem(this.voiceKey, JSON.stringify(this.voice()));
            localStorage.setItem(this.translationKey, JSON.stringify(this.translation()));
            localStorage.setItem(this.textToSpeechKey, JSON.stringify(this.isTextToSpeechActive()));
            localStorage.setItem(this.modelKey, JSON.stringify(this.model()));
        });
    }

    private getSavedLanguage(): Language {
        const lang = this.getSafe(this.translationKey, 'es');
        return (lang === 'es' || lang === 'en') ? lang : 'es';
    }

    public setModel(newModel: ModelConfig) {
        this.model.set(newModel);
    }
}