import { Component, inject, signal } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { SlideInModalService } from '../../core/services/ui/slide-in-modal-service';
import { MatError, MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatDialog, MatDialogContent, MatDialogActions, MatDialogTitle, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PdfService } from '../../core/services/ui/pdf-service';

@Component({
  selector: 'app-gen-quiz-form',
  imports: [MatIcon, MatError, MatFormField,
     MatLabel, MatFormFieldModule, MatInput, MatDialogContent, 
     MatDialogActions, MatDialogTitle, FormsModule, ReactiveFormsModule],
  templateUrl: './gen-quiz-form.html',
  styleUrl: './gen-quiz-form.scss',
})
export class GenQuizForm {


  private dialogRef = inject(MatDialogRef<GenQuizForm>);
  protected instruction = signal('');

    file!: File;
  text = signal('');

private pdfService = inject(PdfService);
  onFileSelected(event: any) {
    this.file = event.target.files[0];
  }

  async extract() {
    if (!this.file) return;

    this.text.set( 'Procesando...');

    try {
      const response = await this.pdfService.extractText(this.file);
      this.text.set(response);
    } catch (e) {
      console.log(e)
      this.text.set( 'Error al leer PDF');
    }
  }

  protected close() { this.dialogRef.close() }



}
