import { Component, effect, inject, input, model } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatError, MatOption, MatSelect, MatSuffix } from "@angular/material/select";
import { MatIcon } from "@angular/material/icon";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatInput } from "@angular/material/input";
import { MatAnchor } from "@angular/material/button";
import { ModelStore } from '../../../core/stores/model-store';
import { SnackBarService } from '../../../core/services/ui/snackbar-service';
import { ModelConfig } from '../../../core/interfaces/model-interface';

@Component({
  selector: 'app-model-form',
  imports: [MatFormField, MatIcon,
    MatError, MatOption, MatProgressSpinner, MatSelect,
    ReactiveFormsModule, MatInput, MatSuffix, MatAnchor],
  templateUrl: './model-form.html',
  styleUrl: './model-form.scss',
})

export class ModelForm {

  private fb = inject(NonNullableFormBuilder);
  protected modelStore = inject(ModelStore);
  public isFormOpen = model<boolean | null>(null);
  private snackbar = inject(SnackBarService);
  public editableModel = input<ModelConfig | null>(null);


  modelForm = this.fb.group({
    model: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
    provider: ['', [Validators.required, Validators.maxLength(255)]],
  });


  constructor() {
    effect(() => {
      const editable = this.editableModel();
      if (editable) {
        this.modelForm.patchValue({
          model: editable.model,
          provider: editable.provider
        });
      }
    })

  }


  createModel() {
    if (this.modelForm.invalid) return;
    const formValues = this.modelForm.getRawValue();
    this.modelStore.createModel(formValues).subscribe({
      next: () => {
        this.isFormOpen.set(false);
      },
      error: (err) => {
        const error = err.error;
        this.snackbar.show(error.message, 'ok');
      }
    });
  }

  updateModel() {
    if (this.modelForm.invalid) return;
    const formValues = this.modelForm.getRawValue();
    this.modelStore.updateModel(this.editableModel()?.id ?? 0, formValues).subscribe({
      next: () => {
        this.snackbar.show('Actualizado', 'ok');
        this.isFormOpen.set(false);
      },
      error: (err) => {
        const error = err.error;
        this.snackbar.show(error.message, 'ok');
      }
    });
  }


  onCancel() {
    this.isFormOpen.set(false);
  }
}