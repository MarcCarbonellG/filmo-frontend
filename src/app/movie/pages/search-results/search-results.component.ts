import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Genre } from '../../models/genre.interface';
import { Language } from '../../models/language.interface';
import { PagedMovieResults } from '../../models/paged-movie-results.interface';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-search-results',
  standalone: false,
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css',
})
export class SearchResultsComponent implements OnInit {
  filterForm!: FormGroup;
  searchResults!: PagedMovieResults;
  originalResults!: PagedMovieResults;
  searchTerm: string = '';
  genreList: Genre[] = [];
  languageList: Language[] = [];
  baseImageUrl: string;
  isGenreDropdownOpen = false;
  isLangDropdownOpen = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private movieService: MovieService,
    private router: Router
  ) {
    this.baseImageUrl = this.movieService.getImageBaseUrl();
  }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      audience: [null],
      genres: this.fb.group({}),
      languages: this.fb.group({}),
      sortBy: ['popularity'],
      sortOrder: ['desc'],
    });
    this.loadMovies();
  }

  goToPage(page: number, query?: string) {
    this.router.navigate(['/search'], {
      queryParams: {
        page,
        query,
      },
    });
  }

  toggleGenreDropdown(): void {
    this.isGenreDropdownOpen = !this.isGenreDropdownOpen;
  }

  toggleLangDropdown(): void {
    this.isLangDropdownOpen = !this.isLangDropdownOpen;
  }

  loadMovies() {
    this.route.queryParams.subscribe((params) => {
      this.searchTerm = params['query'];
      const page = params['page'];
      console.log('aaaaaa', typeof page);
      this.movieService.searchMoviesByTitle(this.searchTerm, page).subscribe({
        next: (data) => {
          console.log(data);
          this.originalResults = data;
          this.searchResults = JSON.parse(JSON.stringify(data));
          this.getGenres();
          this.getLanguages();
        },
        error: () => {
          console.error('Error al cargar películas');
        },
      });
    });
  }

  getGenres() {
    this.movieService.getGenres().subscribe({
      next: (data) => {
        this.genreList = data.filter((g) =>
          this.originalResults.movies.some(
            (m) => m.genre_ids && m.genre_ids.includes(g.id)
          )
        );

        this.genreList.forEach((genre) => {
          (this.filterForm.get('genres') as FormGroup).addControl(
            `${genre.id}`,
            new FormControl(false)
          );
        });
      },
      error: () => {
        console.error('Error al cargar géneros');
      },
    });
  }

  getLanguages() {
    this.movieService.getLanguages().subscribe({
      next: (data) => {
        this.languageList = data.filter((l) =>
          this.originalResults.movies.some(
            (m) => m.original_language === l.iso_639_1
          )
        );
        this.languageList.forEach((lang) => {
          (this.filterForm.get('languages') as FormGroup).addControl(
            lang.iso_639_1,
            new FormControl(false)
          );
        });
      },
      error: () => {
        console.error('Error al cargar películas');
      },
    });
  }

  applyFilters(): void {
    let { audience, genres, languages, sortBy, sortOrder } =
      this.filterForm.value;

    genres = Object.keys(genres)
      .filter((key) => genres[key])
      .map((key) => +key);
    languages = Object.keys(languages).filter((key) => languages[key]);

    let filtered = [...this.originalResults.movies];

    if (audience === true) {
      filtered = filtered.filter((m) => m.adult === true);
    } else if (audience === false) {
      filtered = filtered.filter((m) => m.adult === false);
    }

    if (genres.length > 0) {
      filtered = filtered.filter((movie) =>
        movie.genre_ids?.some((id) => genres.includes(id))
      );
    }

    if (languages.length > 0) {
      filtered = filtered.filter((movie) =>
        languages.includes(movie.original_language)
      );
    }

    if (sortBy === 'popularity') {
      filtered.sort((a, b) =>
        sortOrder === 'asc'
          ? a.popularity - b.popularity
          : b.popularity - a.popularity
      );
    } else if (sortBy === 'release') {
      filtered.sort((a, b) =>
        sortOrder === 'asc'
          ? new Date(a.release_date).getTime() -
            new Date(b.release_date).getTime()
          : new Date(b.release_date).getTime() -
            new Date(a.release_date).getTime()
      );
    }

    this.searchResults.movies = filtered;
  }
}
