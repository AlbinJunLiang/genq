import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../auth/auth-service';
import { SnackBarService } from '../../core/services/ui/snackbar-service';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CountdownService } from '../../core/services/ui/count-down-service';
import { LanguageService } from '../../core/services/ui/language-service';
import { switchMap, take, throwError } from 'rxjs';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-verify-dialog',
  imports: [MatDialogModule, MatIcon],
  templateUrl: './verify-dialog.html',
  styleUrl: './verify-dialog.scss',
})
export class VerifyDialog {
  protected authService = inject(AuthService);
  private snackBarService = inject(SnackBarService);
  private dialogRef = inject(MatDialogRef<VerifyDialog>);
  private countdownService = inject(CountdownService);
  protected languageService = inject(LanguageService);
  private readonly TIMER_KEY = 'verify';
  private readonly COOLDOWN_MINUTES = 10;

  protected step = computed<'initial' | 'sent'>(() =>
    this.countdownService.isActive(this.TIMER_KEY) ? 'sent' : 'initial'
  );

  protected countdown = computed<string>(() =>
    this.countdownService.getLabel(this.TIMER_KEY, '10:00')
  );

  sendVerification() {
    this.authService.refreshAuthStatus().pipe(
      take(1),
      switchMap((isVerified) => {
        if (isVerified) {
          return throwError(() => 'USER_ALREADY_VERIFIED');
        }
        return this.authService.sendEmailVerification().pipe(take(1));
      })
    ).subscribe({
      next: () => {
        this.countdownService.start(this.TIMER_KEY, this.COOLDOWN_MINUTES);
      },
      error: (err) => {
        if (err === 'USER_ALREADY_VERIFIED') {
          this.snackBarService.show(this.languageService.translate('USER_ALREADY_VERIFIED'), "ok");
          this.dialogRef.close();
        } else {
          console.error('Error en el proceso de verificación:', err);
          this.snackBarService.show(this.languageService.translate('ERROR_GENERIC'), "ok");
        }
      }
    });
  }
}
