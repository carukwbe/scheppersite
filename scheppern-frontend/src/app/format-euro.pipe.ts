import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatEuro'
})
export class FormatEuroPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value===null) {
      return '';
    }

    const formattedValue = value!.toLocaleString('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });

    return formattedValue.endsWith(',00') ? formattedValue.replace(',00', ' €') : formattedValue;
  }
}