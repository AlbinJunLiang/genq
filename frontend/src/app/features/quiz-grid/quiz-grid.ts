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

@Component({
  selector: 'app-quiz-grid',
  imports: [MatButtonModule, MatIcon],
  templateUrl: './quiz-grid.html',
  styleUrl: './quiz-grid.scss',
})
export class QuizGrid {

  protected quizStore = inject(QuizStore);
  protected authUserStore = inject(AuthUserStore);
  protected selectedQuizService = inject(SelectedQuizService);
  protected slideInModal = inject(SlideInModalService);
  protected changeSlideViewService = inject(ChangeSlideViewService);

  ngOnInit() {
    if (this.quizStore.quizzes().length === 0) {
      this.quizStore.loadMyQuizzes(1, 8);
    }
  }

  nextPage() {
    const next = this.quizStore.currentPage() + 1;
    if (next <= this.quizStore.totalPages()) {
      this.quizStore.loadMyQuizzes(next, 8);
    }
  }

  prevPage() {
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
}
