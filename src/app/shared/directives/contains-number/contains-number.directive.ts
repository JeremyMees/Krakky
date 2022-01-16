import { AbstractControl, ValidatorFn } from '@angular/forms';

export function containsNumberValidator(
  control: AbstractControl
): { [key: string]: boolean } | null {
  const regex: RegExp = new RegExp(/\d/);
  if (control.value === '') {
    return null;
  } else if (!regex.test(control.value)) {
    return { invalidPassword: true };
  }
  return null;
}
