import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatSelectModule } from '@angular/material/select';
import { MatInput } from "@angular/material/input";
import { MatAnchor, MatButtonModule } from "@angular/material/button";
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { SlideInModalService } from '../../core/services/ui/slide-in-modal-service';
import { dateValidator } from '../../shared/validators/date-validator';
import { CreateQuizDto, Quiz, UpdateQuizDto } from '../../core/interfaces/quiz-interface';
import { QuizStore } from '../../core/stores/quiz-store';
import { SnackBarService } from '../../core/services/ui/snackbar-service';
import { LanguageService } from '../../core/services/ui/language-service';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { SelectedQuizService } from '../../core/services/ui/selected-quiz-service';
import { MatIcon } from "@angular/material/icon";
import { ConfirmDialogComponent } from '../../shared/component/confirm/dialog-component';
import { MatDialog } from '@angular/material/dialog';
import { MatDivider } from "@angular/material/divider";
import { QuestionForm } from "../question-form/question-form";
import { ChangeSlideViewService } from '../../core/services/ui/change-slide-view-service';
import { SlideView } from '../../core/enums/auth-form-type';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-quiz-form',
  imports: [MatFormField, MatLabel, ReactiveFormsModule, MatSelectModule,
    MatInput, MatAnchor, MatDatepicker, MatDatepickerInput,
    MatDatepickerToggle, MatProgressSpinner, MatButtonModule, MatIcon,
    MatDivider, QuestionForm, MatCardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './quiz-form.html',
  styleUrl: './quiz-form.scss',
})
export class QuizForm {
  protected quizForm: FormGroup;
  protected slideInModal = inject(SlideInModalService);
  protected minDate;
  protected quizStore = inject(QuizStore);
  protected localQuiz = signal<Quiz | null>(null);
  protected snackbar = inject(SnackBarService);
  protected languageService = inject(LanguageService);
  public slideView = SlideView;
  protected changeSlideModalService = inject(ChangeSlideViewService);
  protected selectedQuizService = inject(SelectedQuizService);
  private dialog = inject(MatDialog);
  protected isDeleting = signal(false);

  constructor(private fb: FormBuilder) {
    this.minDate = new Date();
    this.quizForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', [Validators.required, Validators.maxLength(600)]],
      visibility: ['PUBLIC', [Validators.required]],
      endAt: [this.minDate, [Validators.required, dateValidator()]],
      durationSeconds: [0, [Validators.min(0)]],
      attemptsLimit: [0, [Validators.min(0)]]
    });


    effect(() => {
      const selectedQuiz = this.selectedQuizService.selectedQuiz();
      if (selectedQuiz != null) {
        this.quizForm.patchValue(
          this.mappingQuizResponse(selectedQuiz)
        );
        this.localQuiz.set(selectedQuiz);
        this.changeSlideModalService.setView(SlideView.EDIT_QUIZ_FORM);
      } else {
        this.changeSlideModalService.setView(SlideView.CREATE_QUIZ_FORM)
        this.setDefaultForm();
      }

    });
  }




  onSubmit() {
    if (this.quizForm.invalid) {
      this.quizForm.markAllAsTouched();
      return;
    }

    const formValue = this.quizForm.value;


    if (this.changeSlideModalService.currentView() == SlideView.CREATE_QUIZ_FORM) {
      const newQuiz: CreateQuizDto = this.buildQuizDto(formValue);
      this.onCreateQuiz(newQuiz);
    } else {
      const editQuiz: UpdateQuizDto = this.buildQuizDto(formValue);

      this.onEditQuiz(this.localQuiz()?.id ?? 0, editQuiz);
    }

  }

  private buildQuizDto(quizForm: any) {
    let utcEndAt = null;
    if (quizForm.endAt) {
      const date = new Date(quizForm.endAt);
      date.setHours(date.getHours() + 1);
      utcEndAt = date.toISOString();
    }
    return {
      title: quizForm.title,
      description: quizForm.description || "Un quiz sobre historia universal",
      visibility: quizForm.visibility || "PUBLIC",
      endAt: utcEndAt ?? "2036-12-31T23:59:59.000Z",
      durationSeconds: (quizForm.durationSeconds * 60) || 300,
      attemptsLimit: quizForm.attemptsLimit || 3
    }

  }

  private onCreateQuiz(newQuiz: CreateQuizDto) {
    this.quizStore.create(newQuiz).subscribe({
      next: (response) => {
        this.localQuiz.set(response.quiz);
        console.log(response.quiz)
        this.quizForm.reset();
        this.quizForm.patchValue(
          this.mappingQuizResponse(response.quiz)
        );

        this.snackbar.show('Creado', 'Ok');
        this.changeSlideModalService.setView(SlideView.EDIT_QUIZ_FORM);
      },
      error: (err) => {
        this.quizForm.enable();
        console.table(err);
        this.snackbar.show(this.languageService.translate(err.error.error) ?? 'Error', 'Ok');
      }
    });
  }


  private mappingQuizResponse(quiz: Quiz) {
    const date = quiz.endAt ? new Date(quiz.endAt) : null;
    return {
      title: quiz.title,
      description: quiz.description,
      visibility: quiz.visibility,
      endAt: date,
      durationSeconds: Number(quiz.durationSeconds) / 60,
      attemptsLimit: quiz.attemptsLimit
    };
  }

  closeForm() {
    this.slideInModal.close();
    this.quizForm.enable();
    this.setDefaultForm();
  }

  setDefaultForm() {
    this.quizForm.patchValue(
      {
        title: '',
        description: '',
        visibility: 'PUBLIC',
        endAt: this.minDate,
        durationSeconds: 0,
        attemptsLimit: 0
      }
    );
  }


  onEditQuiz(quizId: number, quiz: UpdateQuizDto) {
    if (!quizId || !quiz) {
      return;
    }
    this.quizForm.disable();
    this.quizStore.update(quizId, quiz).subscribe({
      next: (response) => {
        this.localQuiz.set(response.quiz);
        this.quizForm.reset();
        this.quizForm.patchValue(
          this.mappingQuizResponse(response.quiz)
        );

        this.snackbar.show('Actualizado correctamente', 'Ok');
        this.changeSlideModalService.setView(SlideView.EDIT_QUIZ_FORM);
        this.quizForm.enable();

      },
      error: (err) => {
        this.quizForm.enable();
        console.table(err);
        this.snackbar.show(this.languageService.translate(err.error.error) ?? 'Error', 'Ok');
      }
    });
  }


  // En tu componente (ej: quiz-form.ts)

  onDeleteQuiz() {
    this.isDeleting.set(true);
    const quizId = this.selectedQuizService.selectedQuiz()?.id ?? this.localQuiz()?.id;
    if (!quizId) {
      this.isDeleting.set(false);
      return
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Cuestionario',
        message: '¿Estás seguro de que quieres borrar este quiz permanentemente?',
        confirmText: 'Borrar',
        cancelText: 'Mejor no',
        color: 'warn'
      }
    });      // Bloqueamos la UI para evitar múltiples clics

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.quizStore.remove(quizId).subscribe({
          next: () => {
            this.snackbar.show('Quiz eliminado correctamente', 'Ok');
            this.changeSlideModalService.setView(SlideView.CREATE_QUIZ_FORM);
            this.quizForm.reset();
            this.slideInModal.close();
            this.isDeleting.set(false);
          },
          error: (err) => {
            console.error(err);
            this.snackbar.show('Error al eliminar el quiz', 'Ok');
            this.isDeleting.set(false);
          }
        });
      } else {
        this.isDeleting.set(false);

      }
    });
  }
}
