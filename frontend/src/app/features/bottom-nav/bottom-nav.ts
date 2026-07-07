import { Component, inject } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { Router } from "@angular/router";
import { FixedBottomLeft } from "../fixed-bottom-left/fixed-bottom-left";
import { ChangeSlideViewService } from '../../core/services/ui/change-slide-view-service';
import { SlideInModalService } from '../../core/services/ui/slide-in-modal-service';
import { SlideView } from '../../core/enums/auth-form-type';
import { AuthService } from '../../auth/auth-service';
import { LanguageService } from '../../core/services/ui/language-service';

@Component({
  selector: 'app-bottom-nav',
  imports: [MatButtonModule, FixedBottomLeft],
  templateUrl: './bottom-nav.html',
  styleUrl: './bottom-nav.scss',
})
export class BottomNav {
  protected changeSlideViewService = inject(ChangeSlideViewService);
  protected slideInModalService = inject(SlideInModalService);
  protected slideInModal = inject(SlideInModalService)
  protected languageService = inject(LanguageService);

  private authService = inject(AuthService);
  private router = inject(Router);


  openLogin() {
    this.changeSlideViewService.setView(SlideView.LOGIN);
    this.slideInModal.open();
  }

  goToPage(route: string = '/') {
    if (this.slideInModalService.isOpen()) {
      this.slideInModalService.close();
    }
    this.router.navigate([route]);
  }

  goToHistory() {
    if (!this.authService.isLoggedIn()) {
      this.openLogin();
    } else {
      this.goToPage('/history')
    }
  }
}
