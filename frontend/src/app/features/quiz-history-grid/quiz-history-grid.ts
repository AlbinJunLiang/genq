import { Component, inject, signal } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { formatReadableDate } from '../../shared/util/date.util';
import { AttemptService } from '../../core/services/api/attempt-service';
import { AttemptStore } from '../../core/stores/attempt-store';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { SnackBarService } from '../../core/services/ui/snackbar-service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/component/confirm/dialog-component';

@Component({
  selector: 'app-quiz-history-grid',
  imports: [MatIcon, MatProgressSpinner],
  templateUrl: './quiz-history-grid.html',
  styleUrl: './quiz-history-grid.scss',
})
export class QuizHistoryGrid {


  protected attemptStore = inject(AttemptStore);
  protected snackbar = inject(SnackBarService);
  private dialog = inject(MatDialog);
  private limit = signal<number>(0);



  ngOnInit(): void {
    this.limit.set(this.attemptStore._limit());
    this.attemptStore.loadAttempts(1, this.limit());
  }

  protected formatDate(date: string) {
    return formatReadableDate(date);
  }


  nextPage() {
    if (this.attemptStore.loading()) return;
    const next = this.attemptStore.currentPage() + 1;
    if (next <= this.attemptStore.totalPages()) {
      this.attemptStore.loadAttempts(next, this.limit());

    }
  }

  prevPage() {
    if (this.attemptStore.loading()) return;
    const prev = this.attemptStore.currentPage() - 1;
    if (prev >= 1) {
      this.attemptStore.loadAttempts(prev, this.limit());
    }
  }


  onDeleteAttempt(attemptId: number) {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar registro',
        message: '¿Estás seguro de que quieres borrar el registro?',
        confirmText: 'Borrar',
        cancelText: 'Mejor no',
        color: 'warn'
      }
    });      // Bloqueamos la UI para evitar múltiples clics

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.attemptStore.deleteATtempt(attemptId).subscribe({
          next: () => {
            this.snackbar.show('Eliminado correctamente', 'Ok');
          },
          error: (err) => {
            console.error(err);
            this.snackbar.show('Error al eliminar', 'Ok');
          }
        });
      }
    });

  }

}
