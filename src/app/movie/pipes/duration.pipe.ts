import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
  standalone: false,
})
export class DurationPipe implements PipeTransform {
  transform(value: number): string {
    if (isNaN(value) || value < 0) return '';

    const hours = Math.floor(value / 60);
    const minutes = value % 60;

    let result = '';
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0 || hours === 0) result += `${minutes}min`;

    return result.trim();
  }
}
