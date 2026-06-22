import { Component, inject } from '@angular/core';
import { QuizGrid } from "../quiz-grid/quiz-grid";
import { MatAnchor } from "@angular/material/button";
import { SlideInModalService } from '../../core/services/ui/slide-in-modal-service';
import { ChangeSlideViewService } from '../../core/services/ui/change-slide-view-service';
import { SlideView } from '../../core/enums/auth-form-type';
import { SelectedQuizService } from '../../core/services/ui/selected-quiz-service';

@Component({
  selector: 'app-quiz-view',
  imports: [QuizGrid, MatAnchor],
  templateUrl: './quiz-view.html',
  styleUrl: './quiz-view.scss',
})
export class QuizView {

  protected slideInModal = inject(SlideInModalService);
  protected changeSlideViewService = inject(ChangeSlideViewService);
  protected selectedQuizService = inject(SelectedQuizService);


  openCreateQuizView() {
    this.selectedQuizService.clearSelectedQuiz();
    this.changeSlideViewService.setView(SlideView.CREATE_QUIZ_FORM);
    this.slideInModal.open()
  }
}
