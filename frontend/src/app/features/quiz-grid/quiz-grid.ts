import { Component, inject } from '@angular/core';
import { QuizStore } from '../../core/stores/quiz-store';
import { MatButtonModule } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { AuthUserStore } from '../../core/stores/auth-user-store';
import { SelectedQuizService } from '../../core/services/ui/selected-quiz-service';
import { Quiz } from '../../core/interfaces/quiz-interface';
import { SlideInModalService } from '../../core/services/ui/slide-in-modal-service';
import { ChangeSlideViewService } from '../../core/services/ui/change-slide-view-service';
import { SlideView } from '../../core/enums/auth-form-type';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatDialog } from '@angular/material/dialog';
import { QuizDetailDialog } from '../quiz-detail-dialog/quiz-detail-dialog';
import { QuizVisibilityService } from '../../core/services/ui/quiz-visibility.service';
import { LanguageService } from '../../core/services/ui/language-service';
import { ConfirmDialogComponent } from '../../shared/component/confirm/dialog-component';
import { SnackBarService } from '../../core/services/ui/snackbar-service';

@Component({
  selector: 'app-quiz-grid',
  imports: [MatButtonModule, MatIcon, MatProgressSpinner],
  templateUrl: './quiz-grid.html',
  styleUrl: './quiz-grid.scss',
})
export class QuizGrid {

  protected quizStore = inject(QuizStore);
  protected authUserStore = inject(AuthUserStore);
  protected selectedQuizService = inject(SelectedQuizService);
  protected slideInModal = inject(SlideInModalService);
  protected changeSlideViewService = inject(ChangeSlideViewService);
  protected languageService = inject(LanguageService);

  private dialog = inject(MatDialog);
  private visibilityService = inject(QuizVisibilityService);
  private snackbar = inject(SnackBarService);



  ngOnInit() {
    if (this.quizStore.total() == 0) {
      this.quizStore.loadQuizzes(1, 8);
    }
  }

  nextPage() {
    if (this.quizStore.isLoading()) return;
    const next = this.quizStore.currentPage() + 1;

    if (next <= this.quizStore.totalPages()) {
      if (this.visibilityService.visibility() === 'GLOBAL') {
        this.quizStore.loadQuizzes(next, 8);
      } else {
        this.quizStore.loadMyQuizzes(next, 8, this.visibilityService.visibility());

      }
    }
  }

  prevPage() {
    if (this.quizStore.isLoading()) return;
    const prev = this.quizStore.currentPage() - 1;
    if (prev >= 1) {
      if (this.visibilityService.visibility() === 'GLOBAL') {
        this.quizStore.loadQuizzes(prev, 8);
      } else {
        this.quizStore.loadMyQuizzes(prev, 8, this.visibilityService.visibility());
      }
    }
  }

  selectQuiz(quiz: Quiz) {
    this.selectedQuizService.clearSelectedQuiz();
    this.selectedQuizService.setSelectedQuiz(quiz);
    this.changeSlideViewService.setView(SlideView.CREATE_QUIZ_FORM);
    this.slideInModal.open()
  }

  openLeaderBoard(quiz: Quiz) {
    this.selectedQuizService.clearSelectedQuiz();
    this.selectedQuizService.setSelectedQuiz(quiz);
    this.changeSlideViewService.setView(SlideView.LEADER_BOARD);
    this.slideInModal.open()

  }

  protected openQuizDetailDialog(quiz: Quiz) {
    const dialogRef = this.dialog.open(QuizDetailDialog, {
      width: '95%',
      maxWidth: '1000px',
      height: '70%',
      data: quiz
    });
  }


  onDeleteQuiz(quiz: Quiz) {
    if (!quiz) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: this.languageService.translate('DELETE_QUIZ_TITLE'),
        message: this.languageService.translate('DELETE_QUIZ_CONFIRMATION'),
        confirmText: this.languageService.translate('DELETE'),
        cancelText: this.languageService.translate('CANCEL'),
        color: 'warn'
      }
    });      // Bloqueamos la UI para evitar múltiples clics

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.quizStore.remove(quiz.id ?? 0).subscribe({
          next: () => {
            this.snackbar.show(this.languageService.translate('DELETED_SUCCESSFULLY'), 'Ok');
            this.slideInModal.close();
          },
          error: (err) => {
            console.error(err);
            this.snackbar.show('Error', 'Ok');
          }
        });
      }
    });
  }


}
