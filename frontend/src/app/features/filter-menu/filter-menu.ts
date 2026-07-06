import { Component, inject } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { MatDivider } from "@angular/material/divider";
import { QuizStore } from '../../core/stores/quiz-store';
import { Router } from '@angular/router';
import { QuizVisibility, QuizVisibilityService } from '../../core/services/ui/quiz-visibility.service';

@Component({
  selector: 'app-filter-menu',
  imports: [MatIcon, MatMenuModule, MatButtonModule, MatDivider],
  templateUrl: './filter-menu.html',
  styleUrl: './filter-menu.scss',
})
export class FilterMenu {
  
  private router = inject(Router);
  protected quizStore = inject(QuizStore);
  private visibilityService = inject(QuizVisibilityService);

  filterQuizzesBy(visibility: string) {
    this.visibilityService.setFilter(visibility as QuizVisibility);
    this.router.navigate(['/quizzes']);
    this.quizStore.loadMyQuizzes(1, 8, visibility);
  }

  filterGlobal(visibility: string) {
        this.visibilityService.setFilter(visibility as QuizVisibility);
    this.quizStore.loadQuizzes(1, 8);
  }
}
