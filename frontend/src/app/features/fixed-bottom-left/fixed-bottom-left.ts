import { Component, inject } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { MatAnchor } from "@angular/material/button";
import { SlideInModalService } from '../../core/services/ui/slide-in-modal-service';
import { LanguageService } from '../../core/services/ui/language-service';

@Component({
  selector: 'app-fixed-bottom-left',
  imports: [MatIcon, MatAnchor],
  templateUrl: './fixed-bottom-left.html',
  styleUrl: './fixed-bottom-left.scss',
})
export class FixedBottomLeft {

  protected languageService =inject(LanguageService);
    protected slideInModal = inject(SlideInModalService);

    protected close (){
      this.slideInModal.close();
    }

}
