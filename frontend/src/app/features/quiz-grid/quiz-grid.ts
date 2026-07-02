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
  private dialog = inject(MatDialog);

  ngOnInit() {
    this.quizStore.loadQuizzes(1, 8);
  }


  nextPage() {
    if (this.quizStore.isLoading()) return;
    const next = this.quizStore.currentPage() + 1;
    if (next <= this.quizStore.totalPages()) {
      this.quizStore.loadMyQuizzes(next, 8);
    }
  }

  prevPage() {
    if (this.quizStore.isLoading()) return;
    const prev = this.quizStore.currentPage() - 1;
    if (prev >= 1) {
      this.quizStore.loadMyQuizzes(prev, 8);
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
}
