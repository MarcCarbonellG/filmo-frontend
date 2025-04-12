import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SimplifiedMovie } from '../../models/simplified-movie.interface';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-search-results',
  standalone: false,
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css',
})
export class SearchResultsComponent implements OnInit {
  searchResults: SimplifiedMovie[] = [];
  searchTerm: string = '';
  baseImageUrl: string;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService
  ) {
    this.baseImageUrl = this.movieService.getImageBaseUrl();
    this.route.queryParams.subscribe((params) => {
      this.searchTerm = params['query'];
    });
  }

  ngOnInit(): void {
    this.movieService.searchMoviesByTitle(this.searchTerm).subscribe({
      next: (data) => {
        this.searchResults = data;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar películas';
      },
    });
  }
}
