import { Component, inject } from '@angular/core';
import { MatMenu, MatMenuTrigger, MatMenuItem } from "@angular/material/menu";
import { MatIcon } from "@angular/material/icon";
import { SlideInModalService } from '../../core/services/ui/slide-in-modal-service';
import { MatAnchor, MatIconButton } from "@angular/material/button";
import { LanguageService } from '../../core/services/ui/language-service';
import { AuthService } from '../../auth/auth-service';
import { SnackBarService } from '../../core/services/ui/snackbar-service';
import { ChangeSlideViewService } from '../../core/services/ui/change-slide-view-service';
import { SlideView } from '../../core/enums/auth-form-type';
import { MatDialog } from '@angular/material/dialog';
import { VerifyDialog } from '../verify-dialog/verify-dialog';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-toolbar-main-menu',
  imports: [MatMenu, MatMenuTrigger, MatIcon, MatIconButton, MatMenuItem, MatDividerModule],
  templateUrl: './toolbar-main-menu.html',
  styleUrl: './toolbar-main-menu.scss',
})
export class ToolbarMainMenu {
  protected slideInModal = inject(SlideInModalService)
  protected languageService = inject(LanguageService);
  protected authService = inject(AuthService);
  protected snackbar = inject(SnackBarService);
  private changeSlideViewService = inject(ChangeSlideViewService);
  private dialog = inject(MatDialog);

  openLogin() {
    this.changeSlideViewService.setView(SlideView.LOGIN);
    this.slideInModal.open();
  }
  openRegister() {
    this.changeSlideViewService.setView(SlideView.REGISTER);
    this.slideInModal.open();
  }

  openForgot() {
    this.changeSlideViewService.setView(SlideView.FORGOT_PASSWORD);
    this.slideInModal.open();
  }
  protected goToChangePassword() {
    this.changeSlideViewService.setView(SlideView.UPDATE_PASSWORD);
    this.slideInModal.open();

  }

  protected logout() {
    this.authService.logout().subscribe({
      next: (user) => {
        this.snackbar.show(this.languageService.translate('SESSION_LOGOUT_MESSAGE'), 'Ok');
      }
    });
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
}
