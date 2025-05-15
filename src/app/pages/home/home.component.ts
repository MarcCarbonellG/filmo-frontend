import { Component, OnInit } from '@angular/core';
import { Observable, take } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { ListShowcase } from '../../list/models/list-showcase.interface';
import { MovieShowcase } from '../../movie/models/movie-showcase.interface';
import { SimplifiedMovie } from '../../movie/models/simplified-movie.interface';
import { MovieService } from '../../movie/services/movie.service';
import { User } from '../../user/models/user.interface';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  user$!: Observable<User | null>;
  errorMessage: string | null = null;
  baseImageUrl: string;
  featured: SimplifiedMovie[] = [];
  movieShowcases: MovieShowcase[] = [];
  movieFollowingShowcase!: MovieShowcase;
  listShowcases: ListShowcase[] = [];
  listFollowingShowcase!: ListShowcase;
  isLoggedIn: boolean = false;

  customOptions = {
    loop: true,
    dots: true,
    nav: false,
    responsive: {
      0: {
        items: 1,
      },
    },
  };

  constructor(
    private movieService: MovieService,
    private authService: AuthService
  ) {
    this.user$ = this.authService.getCurrentUser();
    this.isLoggedIn = this.authService.isAuthenticated();
    this.baseImageUrl = this.movieService.getImageBaseUrl();
  }

  ngOnInit(): void {
    this.loadMovies();
  }

  logout() {
    this.authService.logout();
  }

  loadMovies(): void {
    this.movieService.getMovieCollection('now_playing').subscribe({
      next: (data) => {
        this.featured = data.slice(0, 4);
        this.movieShowcases.push({
          title: 'En cartelera',
          movies: data,
        });
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar películas en cartelera';
      },
    });

    this.movieService.getMovieCollection('upcoming').subscribe({
      next: (data) => {
        this.movieShowcases.push({
          title: 'Próximamente',
          movies: data,
        });
      },
      error: (err) => {
        this.errorMessage =
          'Error al cargar películas que se estrenan próximamente';
      },
    });

    this.movieService.getMovieCollection('popular').subscribe({
      next: (data) => {
        this.movieShowcases.push({
          title: 'Populares (TMDb)',
          movies: data,
        });
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar películas populares';
      },
    });

    this.movieService.getMovieCollection('top_rated').subscribe({
      next: (data) => {
        this.movieShowcases.push({
          title: 'Mejor valoradas',
          movies: data,
        });
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar películas mejor valoradas';
      },
    });

    this.user$.pipe(take(1)).subscribe((user) => {
      if (user) {
        this.movieService.getPopularAmongFollowed(user.id).subscribe({
          next: (data) => {
            this.movieFollowingShowcase = {
              title: 'Populares entre tus seguidores',
              movies: data,
            };
          },
          error: (err) => {
            this.errorMessage = 'Error al cargar películas mejor valoradas';
          },
        });
      }
    });
  }

  loadLists() {}
}
