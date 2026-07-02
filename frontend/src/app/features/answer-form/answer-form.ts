import { Component, inject, signal } from '@angular/core';
import { MatDialogContent, MatDialogActions, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatAnchor } from "@angular/material/button";
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatCheckbox } from "@angular/material/checkbox";
import { MatInput } from "@angular/material/input";
import { AnswerService } from '../../core/services/api/answer-service';
import { Answer, CreateAnswerDto, UpdateAnswerDto } from '../../core/interfaces/answer-interface';
import { AnswerDialogData } from '../../core/interfaces/answer-dialog-data-interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SnackBarService } from '../../core/services/ui/snackbar-service';
import { QuestionStore } from '../../core/stores/question-store';
import { MatProgressSpinner } from "@angular/material/progress-spinner";

@Component({
  selector: 'app-answer-form',
  imports: [MatDialogContent, MatDialogActions, MatAnchor,
    MatFormField, MatLabel, MatCheckbox, MatInput, ReactiveFormsModule, MatFormFieldModule, MatProgressSpinner],
  templateUrl: './answer-form.html',
  styleUrl: './answer-form.scss',
})
export class AnswerForm {

  public dialogRef = inject(MatDialogRef);
  private answerService = inject(AnswerService);
  protected data = inject<AnswerDialogData>(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);
  protected snackbar = inject(SnackBarService);
  protected isLoading = signal(false);

  private questionStore = inject(QuestionStore);
  protected answerForm = this.fb.nonNullable.group({
    content: ['', [Validators.required, Validators.maxLength(600)]],
    isCorrect: [false, [Validators.required]]
  });


  close(): void {
    this.dialogRef.close(); // Cierra sin enviar nada
  }

  ok(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    if (this.data.mode === 'EDIT') {
      this.answerForm.patchValue({
        content: this.data.answer?.content,
        isCorrect: this.data.answer?.isCorrect
      });

    }
  }

  protected onSaveAnswer() {
    this.isLoading.set(true);
    const values = this.answerForm.value;

    const newAnswer: CreateAnswerDto = {
      content: values.content ?? '',
      isCorrect: values.isCorrect ?? false,
      questionId: this.data.question?.id ?? 0,
      status: 'ACTIVE'
    }

    if (this.hasCorrectAnswers(this.data.question?.answers)
      && this.data.question?.type === 'UNIQUE'
      && values.isCorrect) {
      this.snackbar.show('Solo puedes agregar una opción correcta', 'Ok');
      return;
    }


    this.answerService.createAnswer(newAnswer).subscribe({
      next: (created) => {
        this.snackbar.show('CREADO', 'ok');
        this.isLoading.set(false);
        this.dialogRef.close(created);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Error al crear:', err)
      }
    });
  }


  protected onUpdateAnswer() {
    this.isLoading.set(true);

    const values = this.answerForm.value;

    if (!this.data.answer) {
      return;
    }

    // 1. Obtén la fuente de verdad real desde el Store
    const question = this.questionStore.getQuestionById(this.data.answer?.questionId ?? 0)();

    // 2. Validación defensiva: si no hay pregunta, no podemos validar
    if (!question) {
      console.error('No se pudo encontrar la pregunta en el Store');
      return;
    }

    const isUniqueType = question.type === 'UNIQUE';
    const hasCorrectAnswerAlready = this.hasCorrectAnswers(question.answers);

    if (isUniqueType && hasCorrectAnswerAlready && values.isCorrect) {
      this.snackbar.show('There is already a correct answer for this question', 'Error');
      return;
    }

    const answer: UpdateAnswerDto = {
      content: values.content ?? '',
      isCorrect: values.isCorrect ?? false,
      status: 'ACTIVE'
    }
    this.answerService.updateAnswer(this.data.answer.id, answer).subscribe({
      next: (created) => {
        this.snackbar.show('Actualizado', 'ok');
        this.dialogRef.close(created);
        this.isLoading.set(false);

      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Error al crear:', err)
      }
    });
  }

  protected submitAnswer() {
    if (this.data.mode === 'EDIT') {
      this.onUpdateAnswer();
    } else if (this.data.mode === 'CREATE') {
      this.onSaveAnswer();
    }
  }


  private hasCorrectAnswers(answers: Answer[] | undefined): boolean {
    return answers?.some((a: Answer) => a.isCorrect) ?? false;
  }
}