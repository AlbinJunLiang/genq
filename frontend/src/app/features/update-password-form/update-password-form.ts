import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { MatFormField, MatError, MatLabel, MatFormFieldModule } from "@angular/material/form-field";
import { SlideInModalService } from '../../core/services/ui/slide-in-modal-service';
import { LanguageService } from '../../core/services/ui/language-service';
import { ChangeSlideViewService } from '../../core/services/ui/change-slide-view-service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatInputModule } from '@angular/material/input';
import { MatAnchor } from "@angular/material/button";
import { SnackBarService } from '../../core/services/ui/snackbar-service';
import { AuthService } from '../../auth/auth-service';
import { CountdownService } from '../../core/services/ui/count-down-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-update-password-form',
  imports: [MatFormField, MatError, ReactiveFormsModule,
    MatFormFieldModule, MatLabel, MatProgressSpinner,
    MatInputModule, MatAnchor],
  templateUrl: './update-password-form.html',
  styleUrl: './update-password-form.scss',
})
export class UpdatePasswordForm {
  protected languageService = inject(LanguageService);
  protected slideInModal = inject(SlideInModalService);
  protected isLoading = signal(false);
  protected changeSlideViewService = inject(ChangeSlideViewService);
  protected snackbar = inject(SnackBarService);
  protected authService = inject(AuthService);
  private readonly TIMER_KEY = 'forgot';
  private readonly COOLDOWN_MINUTES = 10;
  private countdownService = inject(CountdownService);

  protected email = new FormControl('', [Validators.required, Validators.email]);

  protected step = computed<'initial' | 'sent'>(() =>
    this.countdownService.isActive(this.TIMER_KEY) ? 'sent' : 'initial'
  );

  protected countdown = computed<string>(() =>
    this.countdownService.getLabel(this.TIMER_KEY, '10:00')
  );

  private destroyRef = inject(DestroyRef);

  protected sendResetLink() {
    if (this.email.invalid) {
      this.email.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.authService.sendPasswordResetEmail(this.email.value ?? '')
      .pipe(takeUntilDestroyed(this.destroyRef)) // <--- AQUÍ se pone la magia
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.countdownService.start(this.TIMER_KEY, this.COOLDOWN_MINUTES);
          this.snackbar.show(this.languageService.translate('RECOVERY_EMAIL_SENT'), 'Ok');
        },
        error: (err) => {
          this.isLoading.set(false);
          this.snackbar.show(this.languageService.translate('LINK_SEND_ERROR'), 'Ok');
        }
      });
  }
}