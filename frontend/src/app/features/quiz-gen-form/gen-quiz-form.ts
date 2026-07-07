import { Component, computed, effect, inject, signal } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { MatError, MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatDialogContent, MatDialogActions, MatDialogTitle, MatDialogRef } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PdfService } from '../../core/services/ui/pdf-service';
import { SnackBarService } from '../../core/services/ui/snackbar-service';
import { MatButtonModule } from "@angular/material/button";
import { parseQuiz, QuizSchema } from '../../core/schemas/quiz-schema';
import { MatOption } from "@angular/material/core";
import { MatSelect } from "@angular/material/select";
import { ModelStore } from '../../core/stores/model-store';
import { ConfigService } from '../../core/services/ui/config-service';
import { ModelConfig } from '../../core/interfaces/model-interface';
import { QuizStore } from '../../core/stores/quiz-store';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { finalize } from 'rxjs';
import { LanguageService } from '../../core/services/ui/language-service';
import { jsontemplate } from './json-template';


@Component({
  selector: 'app-gen-quiz-form',
  imports: [MatIcon, MatError, MatFormField,
    MatLabel, MatFormFieldModule, MatInput, MatDialogContent,
    MatDialogActions, MatDialogTitle, FormsModule,
    ReactiveFormsModule, MatButtonModule, MatOption,
    MatSelect, MatProgressSpinner],
  templateUrl: './gen-quiz-form.html',
  styleUrl: './gen-quiz-form.scss',
})
export class GenQuizForm {

  protected instruction = signal('');
  protected isJsonDocument = signal(false);
  protected modelStore = inject(ModelStore);
  protected isLoading = signal(false);
  protected isFileUploading = signal(false);
  protected languageService = inject(LanguageService);

  private dialogRef = inject(MatDialogRef<GenQuizForm>);
  private configService = inject(ConfigService);
  private file!: File;
  private quizStore = inject(QuizStore);
  private snackbar = inject(SnackBarService);

  public selectedModel = this.configService.model;

  constructor() {
    this.modelStore.loadModels();
    effect(() => {
      const loading = this.modelStore.isLoading();
      const models = this.modelStore.models();

      if (!loading && models.length > 0) {
        this.selectModel(models[0]);
      }
    });
  }

  protected parsedJson = computed(() => {
    const content = this.instruction();
    if (!content.trim()) return null;
    try {
      return JSON.parse(content);
    } catch (e) {
      return 'INVALID_JSON';
    }
  });


  protected validation = computed(() => {
    const json = this.parsedJson();
    if (json === null || json === 'INVALID_JSON') return null;
    return QuizSchema.safeParse(json);
  });


  protected isFormValid = computed(() => {
    const isJson = this.isJsonDocument();
    const text = this.instruction().trim();

    // Caso 1: Modo JSON
    if (isJson) {
      const jsonStatus = this.parsedJson();
      const result = this.validation();
      // Es válido si el JSON es un objeto y la validación de Zod fue exitosa
      return jsonStatus !== 'INVALID_JSON' && jsonStatus !== null && result?.success === true;
    }
    // Caso 2: Modo Texto Normal
    // Es válido si no está vacío y no supera los 2000 caracteres
    return text.length > 10 && text.length <= 3000;
  });


  protected returnJsonTemplate() {
    return jsontemplate;
  }

  private pdfService = inject(PdfService);
  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    this.isFileUploading.set(true);
    this.instruction.set('PDF...');

    try {
      const result = await this.pdfService.extractText(file);
      this.instruction.set(result);
    } catch (error) {
      console.error(error);
      this.instruction.set('Error');
    } finally {
      this.isFileUploading.set(false);
    }
  }


  async extract() {
    if (!this.file) return;
    this.instruction.set('...');
    try {
      const response = await this.pdfService.extractText(this.file);
      this.instruction.set(response);
    } catch (e) {
      console.log(e)
      this.instruction.set('Error PDF');
    }
  }


  protected close() {
    this.dialogRef.close()
  }

  protected toggleJsonDocument() {
    this.isJsonDocument.update(value => !value);
  }

  async copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      this.snackbar.show(this.languageService.translate('COPIED_TO_CLIPBOARD'), this.languageService.translate('CLOSE'));
    } catch (err) {
      console.error('Error:', err);
    }
  }

  protected onSelectionChange(id: number) {
    const model = this.modelStore.models().find(m => m.id === id);
    if (model) {
      this.selectedModel.set(model);
    }
  }

  protected selectModel(model: ModelConfig) {
    this.selectedModel.set(model);
  }

  protected createFullQuiz() {
    this.isLoading.set(true);
    this.quizStore.createFullQuiz(parseQuiz(this.instruction()))
      .pipe(
        finalize(() => this.isLoading.set(false)) // Se ejecuta siempre
      )
      .subscribe({
        next: (response) => {
          this.close();
          this.snackbar.show(this.languageService.translate('QUIZ_CREATED_SUCCESSFULLY'), 'OK');
        },
        error: (err) => {
          if (err.error.message.toUpperCase() == 'TOO MANY REQUESTS') {
            this.snackbar.show(this.languageService.translate('TOO_MANY_REQUESTS'), 'OK');
          } else {
            this.snackbar.show(this.languageService.translate('ERROR_CREATING_QUIZ'), 'OK');

          }
        }
      });
  }

  protected generateQuiz() {
    if (this.configService.model() == null && undefined) {
      return;
    }
    this.isLoading.set(true);
    this.quizStore.generateQuiz(
      this.instruction(),
      this.configService.model().model,

      this.configService.model().provider,
      this.languageService.currentLang()
    )
      .pipe(
        finalize(() => this.isLoading.set(false)) 
      )
      .subscribe({
        next: (response) => {
          this.close();
          this.snackbar.show(this.languageService.translate('QUIZ_CREATED_SUCCESSFULLY'), 'OK');
        },
        error: (err) => {
          if (err.error.message.toUpperCase() == 'TOO MANY REQUESTS') {
            this.snackbar.show(this.languageService.translate('TOO_MANY_REQUESTS'), 'OK');

          } else {
            this.snackbar.show(this.languageService.translate('ERROR_CREATING_QUIZ'), 'OK');
          }
        }
      });
  }

  protected onCreateQuiz() {
    if (this.isJsonDocument()) {
      this.createFullQuiz();
    } else {
      this.generateQuiz();
    }
  }
}
