import { AbstractControl } from '@angular/forms';

export const matchValidator = (g: AbstractControl) => {
    const p1 = g.get('password');
    const p2 = g.get('confirmPassword');

    if (!p1 || !p2) return null;

    if (p1.value && p2.value && p1.value !== p2.value) {
        p2.setErrors({ ...p2.errors, mustMatch: true });
        return { mustMatch: true };
    }

    if (p2.hasError('mustMatch')) {
        const errors = { ...p2.errors };
        delete errors['mustMatch'];
        p2.setErrors(Object.keys(errors).length ? errors : null);
    }

    return null;
};