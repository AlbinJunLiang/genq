import { Component, inject } from '@angular/core';
import { LanguageService } from '../../core/services/ui/language-service';

@Component({
  selector: 'app-support-section',
  imports: [],
  templateUrl: './support-section.html',
  styleUrl: './support-section.scss',
})
export class SupportSection {

  protected languageService = inject(LanguageService);

}
