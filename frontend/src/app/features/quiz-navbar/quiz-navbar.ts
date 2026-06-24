import { Component, computed, inject, input, Signal } from '@angular/core';
import { UserAnswer } from '../../core/interfaces/user-answer-interface';
import { QuizNavService } from '../../core/services/ui/quiz-nav-service';
import { QuestionFromQuiz } from '../../core/interfaces/question-interface';

@Component({
  selector: 'app-quiz-navbar',
  imports: [],
  templateUrl: './quiz-navbar.html',
  styleUrl: './quiz-navbar.scss',
})
export class QuizNavbar {
  public userAnswers = input.required<UserAnswer[]>();

  public questionQuantity = input<number>(0);
  questions = input.required<QuestionFromQuiz[] |null>();

  protected quizNavService = inject(QuizNavService);

  protected numbers = computed(() =>
    Array.from(
      { length: this.questionQuantity() },
      (_, i) => i 
    )
  );
}
