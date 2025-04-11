import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { SimplifiedMovie } from '../../movie/models/simplified-movie.interface';
import { MovieService } from '../../movie/services/movie.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  nowPlaying: SimplifiedMovie[] = [];
  upcoming: SimplifiedMovie[] = [];
  popular: SimplifiedMovie[] = [];
  topRated: SimplifiedMovie[] = [];
  errorMessage: string | null = null;
  baseImageUrl: string;

  constructor(
    private movieService: MovieService,
    private authService: AuthService
  ) {
    this.baseImageUrl = this.movieService.getImageBaseUrl();
  }

  ngOnInit(): void {
    this.loadMovies();
  }

  logout() {
    this.authService.logout();
  }

  loadMovies(): void {
    this.movieService.getMovieList('now_playing').subscribe({
      next: (data) => {
        this.nowPlaying = data.results;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar películas en cartelera';
      },
    });

    this.movieService.getMovieList('upcoming').subscribe({
      next: (data) => {
        this.upcoming = data.results;
      },
      error: (err) => {
        this.errorMessage =
          'Error al cargar películas que se estrenan próximamente';
      },
    });

    this.movieService.getMovieList('popular').subscribe({
      next: (data) => {
        this.popular = data.results;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar películas populares';
      },
    });

    this.movieService.getMovieList('top_rated').subscribe({
      next: (data) => {
        this.topRated = data.results;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar películas mejor valoradas';
      },
    });
  }
}
