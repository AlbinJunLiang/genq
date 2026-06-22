import { AbstractControl, ValidationErrors } from "@angular/forms";

export const questionTypeValidator = (control: AbstractControl): ValidationErrors | null => {
  const allowed = ['UNIQUE', 'MULTIPLE'];
  return allowed.includes(control.value) ? null : { invalidType: true };
};