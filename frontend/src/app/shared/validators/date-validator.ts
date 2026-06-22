import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function dateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) return null;

    if (value instanceof Date) {
      return isNaN(value.getTime()) ? { invalidDateFormat: true } : null;
    }

    if (typeof value === 'string') {
      const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
      return regex.test(value) ? null : { invalidDateFormat: true };
    }

    return { invalidDateFormat: true };
  };
}