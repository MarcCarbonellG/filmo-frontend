import { Component, Input, OnChanges } from '@angular/core';
import { PagedLists } from '../../../list/models/paged-lists.interface';
import { PagedDbMovies } from '../../../movie/models/paged-db-movies.interface';
import { PagedMovieResults } from '../../../movie/models/paged-movie-results.interface';

@Component({
  selector: 'app-pagination',
  standalone: false,
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent implements OnChanges {
  @Input() results!: PagedMovieResults | PagedDbMovies | PagedLists;
  @Input() query: string = '';
  @Input() goToPage!: (page: number, query?: string) => void;

  current: number = 0;
  total: number = 0;
  pages: number[] = [];

  ngOnChanges(): void {
    if (this.results) {
      this.current = +this.results.page;
      this.total = +this.results.total_pages;
    }
  }

  get visiblePages(): number[] {
    let start = Math.max(1, this.current - 1);
    let end = Math.min(this.total, this.current + 1);

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
}
