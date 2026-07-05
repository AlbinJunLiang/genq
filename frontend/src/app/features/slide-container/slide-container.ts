import { Component, inject } from '@angular/core';
import { LoginForm } from "../login-form/login-form";
import { RegisterForm } from "../register-form/register-form";
import { ChangeSlideViewService } from '../../core/services/ui/change-slide-view-service';
import { UpdatePasswordForm } from "../update-password-form/update-password-form";
import { QuizForm } from "../quiz-form/quiz-form";
import { LeaderBoard } from "../leader-board/leader-board";
import { GenQuizForm } from "../quiz-gen-form/gen-quiz-form";

@Component({
  selector: 'app-slide-container',
  imports: [LoginForm, RegisterForm, UpdatePasswordForm, QuizForm, LeaderBoard, GenQuizForm],
  templateUrl: './slide-container.html',
  styleUrl: './slide-container.scss',
})
export class SlideContainer {
  protected changeSlideViewService = inject(ChangeSlideViewService);

}
