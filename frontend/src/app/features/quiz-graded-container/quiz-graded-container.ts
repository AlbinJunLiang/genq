import { Component, computed, ElementRef, inject, signal, viewChildren } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { BreakpointService } from '../../core/services/ui/breakpoint-service';
import { QuizGradedService } from '../../core/services/ui/quiz-graded-service';
import { QuizAttemptResponse } from '../../core/interfaces/attempt-interface';
import { EvaluationResult, ReviewItem } from '../../core/interfaces/quiz-review-interface';
import { MatIcon } from "@angular/material/icon";
import { QuizNavService } from '../../core/services/ui/quiz-nav-service';
import { MatDivider } from "@angular/material/divider";
import { QuizNavbar } from "../quiz-navbar/quiz-navbar";
import { LanguageService } from '../../core/services/ui/language-service';

@Component({
  selector: 'app-quiz-graded-container',
  imports: [MatDivider, RouterLink],
  templateUrl: './quiz-graded-container.html',
  styleUrl: './quiz-graded-container.scss',
})
export class QuizGradedContainer {

  public quizData?: QuizAttemptResponse;
  private breakpointService = inject(BreakpointService);
  protected isMobile = this.breakpointService.isMobile;

  protected quizGradedService = inject(QuizGradedService);
  protected evaluationResult = signal<EvaluationResult | null>(null);
  protected reviewItem = signal<ReviewItem[] | null>(null);


  protected isLoading = signal(false);
  protected quizNavService = inject(QuizNavService);
  private router = inject(Router);
  protected reviewCount = computed(() => {
    return this.reviewItem()?.length ?? 0;
  });


  protected questions = viewChildren<ElementRef>('question');
  protected currentQuestion = 0;
  protected languageService = inject(LanguageService);


  ngOnInit() {
    // Recuperas el objeto del servicio
    this.quizData = this.quizGradedService.getData();
    const data = this.quizGradedService.getData();
    if (data) {
      this.reviewItem.set(data.quizAttemptedContent.review);
    }


    if (this.quizData) {
      this.evaluationResult.set(this.quizData.quizAttemptedContent);
      console.log('Datos recibidos con éxito:', this.quizData);
      // Ya puedes usar this.quizData en tu HTML
    } else {
      this.router.navigate(['/history']);
    }
  }



goToQuestion(index: number) {
  const elements = this.questions();
  const destination = elements[index]?.nativeElement;

  if (destination) {
    // 'auto' hace que el movimiento sea instantáneo (sin animación)
    // 'start' respeta el scroll-margin-top que definiste en CSS
    destination.scrollIntoView({ behavior: 'auto', block: 'start' });
    
    this.currentQuestion = index;
  }
}

  protected restartQuiz() {
    const uuid = this.quizGradedService.getData()?.quizUuid;

    if (uuid) {
      // Al usar el arreglo de segmentos, Angular es más eficiente 
      // y maneja mejor los parámetros internamente.
      this.router.navigate(['/quiz', uuid]);
    } else {
      this.router.navigate(['/history']);
    }
  }



}


