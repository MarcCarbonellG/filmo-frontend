import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Genre } from '../../models/genre.interface';
import { Language } from '../../models/language.interface';
import { SimplifiedMovie } from '../../models/simplified-movie.interface';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-search-results',
  standalone: false,
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css',
})
export class SearchResultsComponent implements OnInit {
  filterForm!: FormGroup;
  searchResults: SimplifiedMovie[] = [];
  originalResults: SimplifiedMovie[] = [];
  searchTerm: string = '';
  genreList: Genre[] = [];
  languageList: Language[] = [];
  errorMessage: string | null = null;
  baseImageUrl: string;
  isGenreDropdownOpen = false;
  isLangDropdownOpen = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private movieService: MovieService
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
    this.getGenres();
    this.getLanguages();
    this.route.queryParams.subscribe((params) => {
      this.searchTerm = params['query'];
      this.movieService.searchMoviesByTitle(this.searchTerm).subscribe({
        next: (data) => {
          this.originalResults = data;
          this.searchResults = this.originalResults;
        },
        error: () => {
          this.errorMessage = 'Error al cargar películas';
        },
      });
    });
  }

  toggleGenreDropdown(): void {
    this.isGenreDropdownOpen = !this.isGenreDropdownOpen;
  }

  toggleLangDropdown(): void {
    this.isLangDropdownOpen = !this.isLangDropdownOpen;
  }

  getGenres() {
    this.movieService.getGenres().subscribe({
      next: (data) => {
        this.genreList = data;
        this.genreList.forEach((genre) => {
          (this.filterForm.get('genres') as FormGroup).addControl(
            `${genre.id}`,
            new FormControl(false)
          );
        });
      },
      error: () => {
        this.errorMessage = 'Error al cargar películas';
      },
    });
  }

  getLanguages() {
    this.movieService.getLanguages().subscribe({
      next: (data) => {
        this.languageList = data;
        this.languageList.forEach((lang) => {
          (this.filterForm.get('languages') as FormGroup).addControl(
            lang.iso_639_1,
            new FormControl(false)
          );
        });
      },
      error: () => {
        this.errorMessage = 'Error al cargar películas';
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

    let filtered = [...this.originalResults];

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

    this.searchResults = filtered;
  }
}
