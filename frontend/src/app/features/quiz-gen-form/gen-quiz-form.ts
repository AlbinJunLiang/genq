import { Component, computed, inject, signal } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { SlideInModalService } from '../../core/services/ui/slide-in-modal-service';
import { MatError, MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatDialog, MatDialogContent, MatDialogActions, MatDialogTitle, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PdfService } from '../../core/services/ui/pdf-service';
import { SnackBarService } from '../../core/services/ui/snackbar-service';
import { MatButtonModule } from "@angular/material/button";
import { QuizSchema } from '../../core/schemas/quiz-schema';




@Component({
  selector: 'app-gen-quiz-form',
  imports: [MatIcon, MatError, MatFormField,
    MatLabel, MatFormFieldModule, MatInput, MatDialogContent,
    MatDialogActions, MatDialogTitle, FormsModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './gen-quiz-form.html',
  styleUrl: './gen-quiz-form.scss',
})
export class GenQuizForm {


  private dialogRef = inject(MatDialogRef<GenQuizForm>);
  protected instruction = signal('');
  protected isJsonDocument = signal(false);
  private snackbar = inject(SnackBarService);

  protected parsedJson = computed(() => {
    const content = this.instruction();
    if (!content.trim()) return null; // Si está vacío, no intentar parsear
    try {
      return JSON.parse(content);
    } catch (e) {
      console.log("Error de parseo JSON:", e);
      return 'INVALID_JSON'; // Marcamos explícitamente el error de formato
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



  protected jsontemplate = `Estructura requerida:
{
  "title": "string",
  "description": "string",
  "visibility": "PUBLIC | PRIVATE",
  "attemptsLimit": 3,
  "questions": [
    {
      "content": "string",
      "type": "MULTIPLE | SINGLE",
      "answers": [
        {
          "content": "string",
          "isCorrect": false
        }
      ]
    }
  ]
}
`;


  file!: File;
  text = signal('');

  private pdfService = inject(PdfService);
  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    //this.loading.set(true);
    this.text.set('Procesando PDF...');

    try {
      const result = await this.pdfService.extractText(file);
      this.instruction.set(result);
    } catch (error) {
      console.error(error);
      this.instruction.set('Error al leer el PDF');
    } finally {
      //  this.loading.set(false);
    }
  }
  async extract() {
    if (!this.file) return;

    this.text.set('Procesando...');

    try {
      const response = await this.pdfService.extractText(this.file);
      this.text.set(response);
    } catch (e) {
      console.log(e)
      this.text.set('Error al leer PDF');
    }
  }


  protected close() { this.dialogRef.close() }

  protected toggleJsonDocument() {
    this.isJsonDocument.update(value => !value);
  }

  async copyToClipboard() {
    try {
      await navigator.clipboard.writeText(this.jsontemplate);

      // Feedback visual para el usuario
      this.snackbar.show('¡Copiado al portapapeles!', 'Cerrar');
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  }


}
