import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toolbar } from "./features/toolbar/toolbar";
import { SlideIn } from "./features/slide-in/slide-in";
import { Footer } from "./features/footer/footer";
import { SlideContainer } from "./features/slide-container/slide-container";
import { AuthService } from './auth/auth-service';
import { MatDialog } from '@angular/material/dialog';
import { VerifyDialog } from './features/verify-dialog/verify-dialog';
import { AuthUserStore } from './core/stores/auth-user-store';
import { BottomNav } from "./features/bottom-nav/bottom-nav";
import { SearchService } from './core/services/ui/search-service';
import { SearchBar } from "./features/search-bar/search-bar";
import { QuizStore } from './core/stores/quiz-store';
import { LoadingDot } from "./shared/component/loading-dot/loading-dot";
import { RouteService } from './core/services/ui/route-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toolbar, SlideIn, Footer,
    SlideContainer, BottomNav, SearchBar, LoadingDot],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

  protected authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private authUserStore = inject(AuthUserStore);
  protected searchService = inject(SearchService);
  protected quizStore = inject(QuizStore);
  protected isReady = signal(false);
  protected routeService = inject(RouteService);
  protected isNotQuizRoute = computed(() => !this.routeService.isRoute('/quiz/'));

  ngOnInit() {
    this.isReady.set(false);
    setTimeout(() => {
      this.isReady.set(true);
    }, 1000);
  }


  constructor() {
    this.authUserStore.initSync();
    effect(() => {
      const userData = this.authUserStore.userSyncData();
      if (!userData) {
        return;
      }
    });

    effect(async () => {
      const activeUser = this.authService.user();
      if (activeUser) {
        if (!this.authService.user()?.emailVerified) {
          this.openVerificationDialog();
        }
        const token = await this.authService.getTokenAsync();
        console.log('¡Token recuperado con éxito!:', token);
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
