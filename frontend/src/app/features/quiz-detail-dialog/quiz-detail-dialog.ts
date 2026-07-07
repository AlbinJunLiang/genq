import { afterNextRender, Component, ElementRef, inject, viewChild } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { MatAnchor } from "@angular/material/button";
import { Quiz } from '../../core/interfaces/quiz-interface';
import { formatReadableDate } from '../../shared/util/date.util';
import { Router } from '@angular/router';
import * as QRCode from 'qrcode';
import { LanguageService } from '../../core/services/ui/language-service';

@Component({
  selector: 'app-quiz-detail-dialog',
  imports: [MatDialogModule, MatAnchor, MatIcon],
  templateUrl: './quiz-detail-dialog.html',
  styleUrl: './quiz-detail-dialog.scss',
})
export class QuizDetailDialog {

  public data = inject<Quiz>(MAT_DIALOG_DATA);
  private router = inject(Router);
  private qrCanvas = viewChild<ElementRef<HTMLCanvasElement>>('qrCanvas');
  protected languageService = inject(LanguageService);

  constructor() {
    afterNextRender(() => {
      this.generateQRCode();
    });
  }
  
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

  private generateQRCode() {
    const canvas = this.qrCanvas()?.nativeElement;
    if (!canvas) return;

    // Obtener la URL actual de tu página
    const baseUrl = window.location.origin;
    const dynamicUrl = `${baseUrl}/quiz/${this.data.uuid}`;
    QRCode.toCanvas(canvas, dynamicUrl, {
      width: 200,
      margin: 2
    }, (error) => {
      if (error) console.error('Error generando QR', error);
    });
  }
}
