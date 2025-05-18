import { Component, Input } from '@angular/core';
import { PagedMovieResult } from '../../../movie/models/paged-movie-result.interface';

@Component({
  selector: 'app-pagination',
  standalone: false,
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent {
  @Input() results!: PagedMovieResult;
  @Input() query: string = '';

  get visiblePages(): number[] {
    const current = this.results.page;
    const total = this.results.total_pages;
    let start = Math.max(1, current - 1);
    let end = Math.min(total, current + 1);
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
}
