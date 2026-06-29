import { Component, inject } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { MAT_DIALOG_DATA, MatDialog, MatDialogClose, MatDialogModule } from "@angular/material/dialog";
import { MatAnchor } from "@angular/material/button";
import { Quiz } from '../../core/interfaces/quiz-interface';
import { formatReadableDate } from '../../shared/util/date.util';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz-detail-dialog',
  imports: [MatDialogModule, MatAnchor, MatIcon],
  templateUrl: './quiz-detail-dialog.html',
  styleUrl: './quiz-detail-dialog.scss',
})
export class QuizDetailDialog {

  public data = inject<Quiz>(MAT_DIALOG_DATA);
  private router = inject(Router);

  protected formatDate(date: string) {
    return formatReadableDate(date);
  }

  protected formatDuration(seconds: number | undefined): string {
    if (!seconds) return '0 segundos';

    if (seconds < 60) {
      return `${seconds} segundos`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    } else {
      const hours = Math.floor(seconds / 3600);
      return `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    }
  }

  protected openQuiz() {
    this.router.navigate(['/quiz', this.data.uuid]);

  }


}
