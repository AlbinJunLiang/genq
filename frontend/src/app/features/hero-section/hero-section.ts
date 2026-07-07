import { Component, inject } from '@angular/core';
import { LanguageService } from '../../core/services/ui/language-service';

@Component({
  selector: 'app-hero-section',
  imports: [],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.scss',
})
export class HeroSection {

  protected languageService = inject(LanguageService);

}
