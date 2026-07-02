import { Component, effect, inject, signal } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { SlideInModalService } from '../../core/services/ui/slide-in-modal-service';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatButtonModule } from "@angular/material/button";
import { MatMenu } from "@angular/material/menu";
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { AttemptService } from '../../core/services/api/attempt-service';
import { Pagination } from '../../core/interfaces/pagination-interface';
import { LeaderboardAttempt } from '../../core/interfaces/attempt-interface';
import { finalize } from 'rxjs';
import { formatReadableDate } from '../../shared/util/date.util';
import { SelectedQuizService } from '../../core/services/ui/selected-quiz-service';

import { MatChipSelectionChange, MatChipsModule } from '@angular/material/chips';
type SortAttempt = 'finished_at' | 'score';
type OrderAttempt = 'ASC' | 'DESC';

@Component({
  selector: 'app-leader-board',
  imports: [MatIcon, MatProgressSpinner, MatButtonModule, MatPaginator, MatTableModule, MatChipsModule
  ],
  templateUrl: './leader-board.html',
  styleUrl: './leader-board.scss',
})


export class LeaderBoard {
  protected slideInModal = inject(SlideInModalService);
  private attemptService = inject(AttemptService);
  protected isLoading = signal(false);

  private selectedQuizService = inject(SelectedQuizService);

  protected paginationData = signal<Pagination | null>(null);
  protected leaderboardAttempts = signal<LeaderboardAttempt[] | null>(null);
  protected displayedColumns: string[] = ['position', 'email', 'finishedAt', 'createdAt', 'score'];
  protected closeSlide() {
    this.slideInModal.close();
  }
  protected pageSize = signal(5);
  protected currentPage = signal(1);
  protected totalItems = signal(0);
  protected sortBy = signal<SortAttempt>('score');
  protected order = signal<OrderAttempt>('DESC');


  constructor() {
    effect(() => {
      this.selectedQuizService.selectedQuiz()?.id
      this.loadAttempts(this.selectedQuizService.selectedQuiz()?.id ?? 0);
    });
  }




  private loadAttempts(quizId: number) {
    if (!quizId) return;

    this.isLoading.set(true);

    // 2. Usamos las señales directamente, eliminando riesgo de parámetros cruzados
    this.attemptService.getAttemptsByQuiz(
      quizId,
      this.sortBy(),
      this.order(),
      this.currentPage(),
      this.pageSize()
    )
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (data) => {
          const offset = (this.currentPage() - 1) * this.pageSize();
          this.paginationData.set(data.pagination);
          const attemptsWithPosition = data.attempts.map((item, index) => ({
            ...item,
            position: offset + index + 1 // Asigna la posición calculada
          }));
          this.leaderboardAttempts.set(attemptsWithPosition);
          // Si la API devuelve el total, actualiza la señal si es necesario
        }
      });
  }

  protected getCellValue(element: any, col: string): any {
    if (col === 'score')
      return (`${element[col]}%`);
    if (col != undefined && (col === 'finishedAt' || col === 'createdAt'))
      return formatReadableDate((`${element[col]}`));


    return (`${element[col]}`);
  }

  protected columnNames: { [key: string]: string } = {
    position: 'posición',
    finishedAt: 'Fin',
    createdAt: 'Inicio',
    email: 'Usuario',
    score: 'Calificación'
  };

  // 3. Paginación simplificada
  protected onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);

    const quizId = this.selectedQuizService.selectedQuiz()?.id ?? 0;
    this.loadAttempts(quizId);
  }

protected onFilterChange(value: string): void {


  switch (value) {
    case 'top':
      this.sortBy.set('score');
      this.order.set('DESC');
      break;
    case 'bottom':
      this.sortBy.set('score');
      this.order.set('ASC');
      break;
    case 'recent':
      this.sortBy.set('finished_at');
      this.order.set('DESC');
      break;
    case 'oldest':
      this.sortBy.set('finished_at');
      this.order.set('ASC');
      break;
  }

  // 3. Reset y carga
  this.currentPage.set(1);
  const quizId = this.selectedQuizService.selectedQuiz()?.id ?? 0;
  this.loadAttempts(quizId);
}

}
