import { Component, inject } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { LanguageService } from '../../core/services/ui/language-service';

@Component({
  selector: 'app-information-section',
  imports: [MatIcon],
  templateUrl: './information-section.html',
  styleUrl: './information-section.scss',
})
export class InformationSection {
  protected languageService = inject(LanguageService);
}
