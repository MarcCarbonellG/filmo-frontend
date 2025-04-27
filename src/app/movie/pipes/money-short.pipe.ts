import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moneyShort',
})
export class MoneyShortPipe implements PipeTransform {
  transform(value: number, currencySymbol: string = '$'): string {
    if (value == null || isNaN(value)) {
      return '-';
    }

    let formatted = '';

    if (value >= 1_000_000) {
      formatted = (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (value >= 1_000) {
      formatted = (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
    } else {
      formatted = value.toString();
    }

    return currencySymbol + formatted;
  }
}
