import { Component, inject } from '@angular/core';
import { LanguageService } from '../../core/services/ui/language-service';
import { AuthUserStore } from '../../core/stores/auth-user-store';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {

  protected languageService = inject(LanguageService);
  protected userStore = inject(AuthUserStore);
}
