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
import { VerifyDialog } from '../verify-dialog/verify-dialog';

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
    const isLoggedIn = this.authService.isLoggedIn();

    if (!isLoggedIn) {
      this.openLogin();
      return;
    }

    const isVerified = this.authService.user()?.emailVerified === true;

    if (!isVerified) {
      this.openVerificationDialog();
      return;
    }

    this.selectedQuizService.clearSelectedQuiz();
    this.changeSlideViewService.setView(SlideView.CREATE_QUIZ_FORM);
    this.slideInModal.open();
  }

  openGenerate() {
    const isLoggedIn = this.authService.isLoggedIn();

    if (!isLoggedIn) {
      this.openLogin();
      return;
    }

    const isVerified = this.authService.user()?.emailVerified;

    if (!isVerified) {
      this.openVerificationDialog();
      return;
    }

    this.dialog.open(GenQuizForm, {
      width: '95%',
      maxWidth: '600px',
      height: this.breakPointService.isMobile() ? '90%' : '75%',
      disableClose: true,
    });
  }


  openLogin() {
    this.changeSlideViewService.setView(SlideView.LOGIN);
    this.slideInModal.open();
  }



  protected openVerificationDialog() {
    this.dialog.open(VerifyDialog, {
      width: '100%',
      maxWidth: '380px',
      disableClose: true,
      autoFocus: false,
      restoreFocus: false,
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms'
    });
  }
}
