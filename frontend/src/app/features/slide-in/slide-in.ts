import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SlideInModalService } from '../../core/services/ui/slide-in-modal-service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from "@angular/material/input";


@Component({
  selector: 'app-slide-in',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './slide-in.html',
  styleUrl: './slide-in.scss',
})
export class SlideIn {
  protected slideInModal = inject(SlideInModalService);

}
