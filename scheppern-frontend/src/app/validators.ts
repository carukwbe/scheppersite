import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';
import { Global } from 'src/environments/environment';

function elimWhitespaces(control: AbstractControl): { [key: string]: boolean } | null {
  if (typeof control.value === 'string') {
    const cleanedValue = control.value.replace(/\s/g, '');

    if (cleanedValue !== control.value) {
      control.setValue(cleanedValue);
    }
  }
  return null;
}

export const nameValidators: ValidatorFn[] = [
  Validators.pattern(/^[ A-Za-z\u00C0-\u017F-']+$/u),
  Validators.maxLength(Global.nameCharLimit)
];

export const phoneValidators: ValidatorFn[] = [
  elimWhitespaces,
  Validators.pattern(/^\+?[0-9 ]+$/),
  Validators.minLength(6),
  Validators.maxLength(15)
];

export const emailValidators: ValidatorFn[] = [
  Validators.email,
  Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/),
  Validators.maxLength(320)
];

export const textValidators: ValidatorFn[] = [
  Validators.pattern(/^[ A-Za-z\u00C0-\u017F\d,:().?!]+$/),
  Validators.maxLength(Global.textAreaCharLimit)
];

export const ticketIDValidators: ValidatorFn[] = [
  Validators.pattern(/^[0-9a-z]+$/i),
  Validators.minLength(20),
  Validators.maxLength(20)
];
