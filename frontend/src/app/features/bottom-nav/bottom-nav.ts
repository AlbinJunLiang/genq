import { Component, inject } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { Router, RouterLink } from "@angular/router";
import { FixedBottomLeft } from "../fixed-bottom-left/fixed-bottom-left";
import { ChangeSlideViewService } from '../../core/services/ui/change-slide-view-service';
import { SlideInModalService } from '../../core/services/ui/slide-in-modal-service';
import { SlideView } from '../../core/enums/auth-form-type';
import { AuthService } from '../../auth/auth-service';

@Component({
  selector: 'app-bottom-nav',
  imports: [MatButtonModule, FixedBottomLeft],
  templateUrl: './bottom-nav.html',
  styleUrl: './bottom-nav.scss',
})
export class BottomNav {
  protected changeSlideViewService = inject(ChangeSlideViewService);
  protected slideInModalService = inject(SlideInModalService);
  private router = inject(Router);
  protected slideInModal = inject(SlideInModalService)
  private authService = inject(AuthService);

  openLogin() {
    this.changeSlideViewService.setView(SlideView.LOGIN);
    this.slideInModal.open();
  }

  // Método para navegar
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
