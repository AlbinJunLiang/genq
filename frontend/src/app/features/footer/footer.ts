import { Component, inject } from '@angular/core';
import { LanguageService } from '../../core/services/ui/language-service';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {

  protected languageService = inject(LanguageService);
}
