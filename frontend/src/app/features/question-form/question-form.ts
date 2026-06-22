import { Component, computed, effect, ElementRef, inject, input, signal, untracked, viewChild } from '@angular/core';
import { MatFormField, MatLabel, MatError, MatSuffix } from "@angular/material/form-field";
import { MatOption } from "@angular/material/core";
import { MatSelect } from "@angular/material/select";
import { MatInput } from "@angular/material/input";
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { questionTypeValidator } from '../../shared/validators/question-type-validator';
import { MatAnchor, MatIconButton } from "@angular/material/button";
import { QuestionStore } from '../../core/stores/question-store';
import { MatListModule } from '@angular/material/list';
import { Question, QuestionType } from '../../core/interfaces/question-interface';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIcon } from "@angular/material/icon";
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AnswerForm } from '../answer-form/answer-form';
import { SnackBarService } from '../../core/services/ui/snackbar-service';
import { AnswerDialogData } from '../../core/interfaces/answer-dialog-data-interface';
import { Answer, AnswerResponse } from '../../core/interfaces/answer-interface';
import { MatMenu, MatMenuItem, MatMenuModule } from "@angular/material/menu";
import { AnswerService } from '../../core/services/api/answer-service';
import { ConfirmDialogComponent } from '../../shared/component/confirm/dialog-component';

@Component({
  selector: 'app-question-form',
  imports: [MatFormField, MatLabel, MatOption, MatSelect,
    MatInput, MatAnchor, MatListModule, MatCheckboxModule,
    MatIcon, MatIconButton, MatError, ReactiveFormsModule,
    CommonModule, MatMenu, MatMenuItem, MatMenuModule, MatSuffix],
  templateUrl: './question-form.html',
  styleUrl: './question-form.scss',
})
export class QuestionForm {
  protected content = signal('');
  protected feedback = signal('');
  protected type = signal('');
  protected questionStore = inject(QuestionStore);
  public quizId = input<number>(0);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  protected questionFormRef = viewChild<ElementRef>('questionFormRef');
  protected snackbar = inject(SnackBarService);
  private answerService = inject(AnswerService);
  protected activeEditQuestion = signal<Question | null>(null);
  protected searchTerm = signal('');
  protected filteredQuestions = computed(() =>
    this.questionStore.findByContent(this.searchTerm())()
  );

  protected questionForm = this.fb.nonNullable.group({
    content: ['', [Validators.required, Validators.maxLength(600)]],
    feedback: ['', [Validators.maxLength(600)]],
    type: new FormControl<QuestionType>('UNIQUE', {
      nonNullable: true,
      validators: [
        Validators.required,
        questionTypeValidator
      ]
    })
  });

  constructor() {
    effect(() => {
      if (this.quizId() == 0) {
        return;
      } else {
        untracked(() => {
          this.questionStore.load(this.quizId());
        });
      }
    });

  }

  protected scrollToQuestionForm() {
    const element = this.questionFormRef()?.nativeElement;
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  protected selectEditQuestion(question: Question) {
    this.scrollToQuestionForm();
    this.activeEditQuestion.set(question);
    this.questionForm.patchValue(
      {
        content: question.content,
        feedback: question.feedback,
        type: question.type
      }
    );
  }

  protected onCancelEdit() {
    this.activeEditQuestion.set(null);
    this.questionForm.reset();
  }

  protected createQuestion() {
    if (this.questionForm.invalid) {
      this.questionForm.markAllAsDirty();
      return;
    }
    const values = this.questionForm.value;
    this.questionStore.create({
      content: values.content ?? '',
      type: values.type ?? 'UNIQUE',
      quizId: this.quizId(),
      feedback: values.feedback,
      status: 'ACTIVE'
    }).subscribe({
      next: () => {
        this.questionForm.reset();
        this.snackbar.show("Pregunta creada con éxito", 'Ok');
      },
      error: (err) => {
        this.snackbar.show("Ha ocurrido un error", 'Ok');
      }
    });
  }

  protected updateQuestion() {
    if (this.questionForm.invalid) {
      this.questionForm.markAllAsDirty();
      return;
    }
    const values = this.questionForm.value;
    this.questionStore.update(this.activeEditQuestion()?.id ?? 0, {
      content: values.content ?? '',
      type: values.type ?? 'UNIQUE',
      quizId: this.quizId(),
      feedback: values.feedback,
      status: 'ACTIVE'
    }).subscribe({
      next: (response) => {
        this.questionForm.reset();
        this.snackbar.show("Pregunta actualizada con éxito", 'Ok');
      },
      error: (err) => {
        this.snackbar.show("Ha ocurrido un error", 'Ok');
      }
    });
  }


  protected openAddAnswerForm(question: Question) {
    const dialogRef = this.dialog.open<AnswerForm, AnswerDialogData, AnswerResponse>(AnswerForm, {
      width: '90%',
      disableClose: true,
      data: {
        question: question,
        mode: 'CREATE'
      }
    });
    dialogRef.afterClosed().subscribe((result: AnswerResponse | undefined) => {
      if (!result) {
        return;
      }
      this.questionStore.addAnswer(question.id, result);
      this.questionStore.updateAnswer(question.id, result.id, result);
    });
  }


  protected openUpdateAnswerForm(answer: Answer) {
    const dialogRef = this.dialog.open<AnswerForm, AnswerDialogData, AnswerResponse>(AnswerForm, {
      width: '90%',
      disableClose: true,
      data: {
        answer: answer,
        mode: 'EDIT'
      }
    });
    dialogRef.afterClosed().subscribe((result: AnswerResponse | undefined) => {
      if (!result) {
        return;
      }
      this.questionStore.updateAnswer(result.questionId, result.id, result);
    });
  }


  protected onDeleteAnswer(answer: Answer) {

    this.answerService.deleteAnswer(answer.id).subscribe({
      next: () => {
        this.questionStore.deleteAnswer(answer.questionId, answer.id);
        this.snackbar.show('Respuesta eliminada correctamente', 'ok');
      },
      error: (err) => {
        this.snackbar.show('Error al eliminar la respuesta', 'error');
      }
    });
  }

  protected onDeleteQuestion(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Pregunta?',
        message: '¿Estás seguro de que quieres borrar esta pregunta?',
        confirmText: 'Borrar',
        cancelText: 'Mejor no',
        color: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteQuestion(id);
      }
    });
  }

  private deleteQuestion(idQuestion: number) {
    this.questionStore.delete(idQuestion).subscribe({
      next: () => {
        this.snackbar.show('Pregunta eliminada con éxito del store y de la API', 'Ok');
      },
      error: (err) => {
        console.error('Error al intentar eliminar:', err);
      }
    });
  }
}
