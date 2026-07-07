import { Component, inject, signal } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { formatReadableDate } from '../../shared/util/date.util';
import { AttemptStore } from '../../core/stores/attempt-store';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { SnackBarService } from '../../core/services/ui/snackbar-service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/component/confirm/dialog-component';
import { Router } from '@angular/router';
import { QuizAttemptResponse } from '../../core/interfaces/attempt-interface';
import { QuizGradedService } from '../../core/services/ui/quiz-graded-service';
import { LanguageService } from '../../core/services/ui/language-service';

@Component({
  selector: 'app-quiz-history-grid',
  imports: [MatIcon, MatProgressSpinner],
  templateUrl: './quiz-history-grid.html',
  styleUrl: './quiz-history-grid.scss',
})
export class QuizHistoryGrid {


  protected attemptStore = inject(AttemptStore);
  protected snackbar = inject(SnackBarService);
  protected languageService = inject(LanguageService);

  private dialog = inject(MatDialog);
  private limit = signal<number>(0);
  private router = inject(Router);
  private quizGradedService = inject(QuizGradedService)


  ngOnInit(): void {
    this.limit.set(this.attemptStore._limit());
    this.attemptStore.loadAttempts(1, this.limit());
  }

  protected formatDate(date: string) {
    return formatReadableDate(date);
  }


  nextPage() {
    if (this.attemptStore.loading()) return;
    const next = this.attemptStore.currentPage() + 1;
    if (next <= this.attemptStore.totalPages()) {
      this.attemptStore.loadAttempts(next, this.limit());

    }
  }

  prevPage() {
    if (this.attemptStore.loading()) return;
    const prev = this.attemptStore.currentPage() - 1;
    if (prev >= 1) {
      this.attemptStore.loadAttempts(prev, this.limit());
    }
  }


  onDeleteAttempt(attemptId: number) {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: this.languageService.translate('DELETE_RECORD_TITLE'),
        message: this.languageService.translate('DELETE_RECORD_CONFIRMATION'),
        confirmText: 'Borrar',
        cancelText: this.languageService.translate('CANCEL'),
        color: 'warn'
      }
    });      // Bloqueamos la UI para evitar múltiples clics

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.attemptStore.deleteATtempt(attemptId).subscribe({
          next: () => {
            this.snackbar.show(this.languageService.translate('DELETED_SUCCESSFULLY'), 'Ok');
          },
          error: (err) => {
            console.error(err);
            this.snackbar.show('Error', 'Ok');
          }
        });
      }
    });

  }

  protected goToGradedQuiz(object: QuizAttemptResponse) {
    this.router.navigate(['/graded']);
    this.quizGradedService.setData(object);
  }

  private restartQuiz(uuid: string) {
    this.router.navigate(['/quiz', uuid]);
  }


  protected onRestartQuiz(uuid: string) {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: this.languageService.translate('RESET_QUIZ_TITLE'),
        message: this.languageService.translate('RESET_QUIZ_MESSAGE'),
        confirmText: this.languageService.translate('ACCEPT'),
        cancelText: this.languageService.translate('CANCEL'),
        color: 'warn'
      }
    });      // Bloqueamos la UI para evitar múltiples clics

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.restartQuiz(uuid);
      }
    });
  }

}
