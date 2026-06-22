import { Component, inject, signal } from '@angular/core';
import { LanguageService } from '../../core/services/ui/language-service';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { matchValidator } from '../../shared/validators/password-match-validator';
import { MatError, MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { SlideInModalService } from '../../core/services/ui/slide-in-modal-service';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatAnchor } from "@angular/material/button";
import { SlideView } from '../../core/enums/auth-form-type';
import { ChangeSlideViewService } from '../../core/services/ui/change-slide-view-service';
import { AuthService } from '../../auth/auth-service';
import { switchMap } from 'rxjs';
import { SnackBarService } from '../../core/services/ui/snackbar-service';
import { CountdownService } from '../../core/services/ui/count-down-service';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatDialog } from '@angular/material/dialog';
import { VerifyDialog } from '../verify-dialog/verify-dialog';

@Component({
  selector: 'app-register-form',
  imports: [MatError, MatFormField, MatLabel, MatFormFieldModule,
    ReactiveFormsModule, MatIcon, MatInputModule, MatAnchor, MatProgressSpinner],
  templateUrl: './register-form.html',
  styleUrl: './register-form.scss',
})
export class RegisterForm {

  private fb = inject(NonNullableFormBuilder);
  public form: FormGroup = this.createForm();
  protected hidePassword = signal(true);
  protected hidePasswordConfirm = signal(true);
  protected languageService = inject(LanguageService);
  protected slideInModal = inject(SlideInModalService);

  protected changeSlideViewService = inject(ChangeSlideViewService);

  protected isLoading = signal(false);
  private authService = inject(AuthService);
  private readonly TIMER_KEY = 'verify';
  private readonly COOLDOWN_MINUTES = 10;
  private snackBar = inject(SnackBarService);
  private countdownService = inject(CountdownService);
  private dialog = inject(MatDialog);



  private createForm(): FormGroup {
    return this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [Validators.required, Validators.minLength(6), Validators.maxLength(50)]
        ],
        confirmPassword: [
          '',
          [Validators.required, Validators.minLength(6), Validators.maxLength(50)]
        ],
      },
      {
        validators: matchValidator
      });
  }

  togglePassword(event: MouseEvent) {
    this.hidePassword.update(prev => !prev);
    event.stopPropagation();
  }

  togglePasswordConfirm(event: MouseEvent) {
    this.hidePasswordConfirm.update(prev => !prev);
    event.stopPropagation();
  }


  onRegister() {
    if (this.form.valid) {
      this.isLoading.set(true);

      const { email, password } = this.form.value;
      this.authService.register(email!, password!, email!)
        .pipe(
          switchMap(() => this.authService.sendEmailVerification())
        )
        .subscribe({
          next: () => {
            this.isLoading.set(false);
            this.form.reset();
            this.countdownService.start(this.TIMER_KEY, this.COOLDOWN_MINUTES);
            this.slideInModal.close();
            this.openVerificationDialog();
          },
          error: (err) => {
            this.isLoading.set(false);
            this.snackBar.show(this.languageService.translate('USER_ALREADY_REGISTERED'), 'Ok');
          }
        });

    } else {
      this.form.markAllAsTouched();
    }
  }


  protected goToLogin() {
    this.changeSlideViewService.setView(SlideView.LOGIN);
  }

  protected openVerificationDialog() {
    this.dialog.open(VerifyDialog, {
      width: '100%',
      maxWidth: '380px',
      disableClose: true,
      autoFocus: false,
      restoreFocus: false,
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms'
    });
  }

  protected closeSlide() {
    this.slideInModal.close();
    this.form.reset();
  }
  protected openForgot() {
    this.changeSlideViewService.setView(SlideView.FORGOT_PASSWORD);
    this.slideInModal.open();
  }
}
