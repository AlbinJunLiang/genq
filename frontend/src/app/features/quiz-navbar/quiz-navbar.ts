import { Component, computed, inject, input, Signal } from '@angular/core';
import { UserAnswer } from '../../core/interfaces/user-answer-interface';
import { QuizNavService } from '../../core/services/ui/quiz-nav-service';
import { QuestionFromQuiz } from '../../core/interfaces/question-interface';
import { ReviewItem } from '../../core/interfaces/quiz-review-interface';

@Component({
  selector: 'app-quiz-navbar',
  imports: [],
  templateUrl: './quiz-navbar.html',
  styleUrl: './quiz-navbar.scss',
})
export class QuizNavbar {
  public userAnswers = input.required<UserAnswer[]>();

  public isFinalized = input<boolean>(false);
  public questions = input.required<QuestionFromQuiz[] | null>();

  public reviews = input.required<ReviewItem[] | null | undefined>();


  protected quizNavService = inject(QuizNavService);

  protected numbers = computed(() =>
    Array.from(
      { length: this.questions.length },
      (_, i) => i
    )
  );
}
