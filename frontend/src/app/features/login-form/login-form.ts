import { Component, inject, signal } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAnchor } from '@angular/material/button';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { SlideInModalService } from '../../core/services/ui/slide-in-modal-service';
import { LanguageService } from '../../core/services/ui/language-service';
import { MatIcon } from "@angular/material/icon";
import { ChangeSlideViewService } from '../../core/services/ui/change-slide-view-service';
import { SlideView } from '../../core/enums/auth-form-type';
import { AuthService } from '../../auth/auth-service';
import { SnackBarService } from '../../core/services/ui/snackbar-service';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { finalize } from 'rxjs';


@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatAnchor, MatIcon, MatProgressSpinner],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {
  protected hidePassword = signal(true);
  protected slideInModal = inject(SlideInModalService);
  protected languageService = inject(LanguageService)
  protected changeSlideViewService = inject(ChangeSlideViewService);
  protected isLoading = signal(false);
  protected isLoadingWithProvider = signal(false);

  protected authService = inject(AuthService);
  private snackBar = inject(SnackBarService);
  private fb = inject(NonNullableFormBuilder);
  public form: FormGroup = this.createForm();
  private createForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(50)
      ]],
    });
  }

  onLogin() {
    if (this.form.invalid) return;
    this.isLoading.set(true);
    const { email, password } = this.form.value;

    this.authService.login(email, password).subscribe({
      next: (user) => {
        this.isLoading.set(false);
        this.snackBar.show(`${this.languageService.translate('WELCOME')} ${this.authService.user()?.email}!`, 'Ok');
        this.slideInModal.close()
        this.form.reset();
      },
      error: (err: any) => {
        this.isLoading.set(false);
        if (err.code === 'auth/invalid-credential') {
          this.snackBar.show(`${this.languageService.translate('INVALID_CREDENTIALS')}`, 'Ok');
        } else {
          this.snackBar.show(this.languageService.translate('ERROR_SIGNIN_MESSAGE'), 'Ok');
        }
      }
    });
  }

  loginWithGoogle() {
    this.isLoadingWithProvider.set(true);
    this.authService.loginWithProvider().pipe(
      finalize(() => this.isLoadingWithProvider.set(false))
    ).subscribe({
      next: () => {
        this.snackBar.show(`${this.languageService.translate('WELCOME')} ${this.authService.user()?.email}!`, 'Ok');
        this.slideInModal.close()
      },
      error: (err) => {
        this.snackBar.show(this.languageService.translate('ERROR_SIGNIN_MESSAGE'), 'Ok');
      }
    });
  }


 protected togglePassword(event: MouseEvent) {
    this.hidePassword.update(prev => !prev);
    event.stopPropagation();
  }
  protected goToRegister() {
    this.changeSlideViewService.setView(SlideView.REGISTER);
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
