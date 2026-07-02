import { Component, inject } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { MatDivider } from "@angular/material/divider";
import { QuizStore } from '../../core/stores/quiz-store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-filter-menu',
  imports: [MatIcon, MatMenuModule, MatButtonModule, MatDivider],
  templateUrl: './filter-menu.html',
  styleUrl: './filter-menu.scss',
})
export class FilterMenu {
  private router = inject(Router);

  protected quizStore = inject(QuizStore);

  filterQuizzesBy(visibility: string) {
    this.router.navigate(['/quizzes']);
    this.quizStore.loadMyQuizzes(1, 8, visibility);
  }

  filterGlobal() {
    this.quizStore.loadQuizzes(1, 8);
  }
}
