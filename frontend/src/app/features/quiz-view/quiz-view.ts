import { Component, inject } from '@angular/core';
import { QuizGrid } from "../quiz-grid/quiz-grid";
import { MatAnchor } from "@angular/material/button";
import { SlideInModalService } from '../../core/services/ui/slide-in-modal-service';
import { ChangeSlideViewService } from '../../core/services/ui/change-slide-view-service';
import { SlideView } from '../../core/enums/auth-form-type';
import { SelectedQuizService } from '../../core/services/ui/selected-quiz-service';
import { QuizStore } from '../../core/stores/quiz-store';
import { AuthService } from '../../auth/auth-service';
import { MatDialog } from '@angular/material/dialog';
import { GenQuizForm } from '../quiz-gen-form/gen-quiz-form';
import { BreakpointService } from '../../core/services/ui/breakpoint-service';
import { LanguageService } from '../../core/services/ui/language-service';

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
  protected quizStore = inject(QuizStore);
  protected languageService = inject(LanguageService);

  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private breakPointService = inject(BreakpointService);


  openCreateQuizView() {
    if (this.authService.isLoggedIn()) {
      this.selectedQuizService.clearSelectedQuiz();
      this.changeSlideViewService.setView(SlideView.CREATE_QUIZ_FORM);
      this.slideInModal.open()
    } else {
      this.openLogin();
    }
  }

  openGenerate() {
    if (this.authService.isLoggedIn()) {
      const dialogRef = this.dialog.open(GenQuizForm, {
        width: '95%',
        maxWidth: '600px',
        height: this.breakPointService.isMobile() ? '90%' : '75%',
        disableClose: true,
      });

    } else {
      this.openLogin();
    }

  }

  openLogin() {
    this.changeSlideViewService.setView(SlideView.LOGIN);
    this.slideInModal.open();
  }
}
