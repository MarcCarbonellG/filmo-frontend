import { Component, OnInit } from '@angular/core';
import { Observable, take } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { ListShowcase } from '../../list/models/list-showcase.interface';
import { ListService } from '../../list/services/list.service';
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
  baseImageUrl: string;
  featured: SimplifiedMovie[] = [];
  movieShowcases: MovieShowcase[] = [];
  movieFollowingShowcase!: MovieShowcase;
  listShowcases: ListShowcase[] = [];
  listFollowingShowcase!: ListShowcase;
  isLoggedIn: boolean = false;
  scale: number = 1;

  customOptions = {
    loop: true,
    dots: true,
    nav: false,
    responsive: {
      0: {
        items: 1,
      },
    },
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    autoplaySpeed: 1000,
    smartSpeed: 600,
  };

  constructor(
    private movieService: MovieService,
    private authService: AuthService,
    private listService: ListService
  ) {
    this.user$ = this.authService.getCurrentUser();
    this.isLoggedIn = this.authService.isAuthenticated();
    this.baseImageUrl = this.movieService.getImageBaseUrl();
  }

  ngOnInit(): void {
    this.loadMovies();
    this.loadLists();
    this.setScale(window.innerWidth);

    window.addEventListener('resize', () => {
      this.setScale(window.innerWidth);
    });
  }

  setScale(width: number) {
    if (width < 640) {
      this.scale = 0.8;
    } else if (width < 768) {
      this.scale = 1;
    } else if (width < 1024) {
      this.scale = 0.5;
    } else if (width < 1280) {
      this.scale = 0.6;
    } else {
      this.scale = 0.8;
    }
  }

  logout() {
    this.authService.logout();
  }

  loadMovies(): void {
    this.loadMovieCollections();
    this.loadPopularMoviesAmongFollowed();
  }

  loadMovieCollections() {
    const collections = [
      { name: 'now_playing', title: 'En cartelera' },
      { name: 'upcoming', title: 'Próximamente' },
      { name: 'popular', title: 'Populares' },
      { name: 'top_rated', title: 'Mejor valoradas' },
    ];

    collections.forEach((collection) => {
      this.movieService.getMovieCollection(collection.name).subscribe({
        next: (data) => {
          if (collection.name === 'now_playing')
            this.featured = data.slice(0, 5);
          this.movieShowcases.push({
            title: collection.title,
            movies: data,
          });
        },
        error: () => {
          console.error(
            `Error al cargar colección de peliculas: ${collection.title}`
          );
        },
      });
    });
  }

  loadPopularMoviesAmongFollowed() {
    this.user$.pipe(take(1)).subscribe((user) => {
      if (user) {
        this.movieService.getPopularAmongFollowed(user.id).subscribe({
          next: (data) => {
            this.movieFollowingShowcase = {
              title: 'Populares entre tus seguidos',
              movies: data,
            };
          },
          error: () => {
            console.error(
              'Error al cargar películas populares entre tus seguidos'
            );
          },
        });
      }
    });
  }

  loadLists() {
    this.loadPopularLists();
    this.loadFollowedLists();
  }

  loadPopularLists() {
    this.listService.getPopularLists().subscribe({
      next: (data) => {
        this.listShowcases.push({
          title: 'Listas populares',
          lists: data,
        });
      },
      error: () => {
        console.error('Error al cargar listas populares');
      },
    });
  }

  loadFollowedLists() {
    this.user$.pipe(take(1)).subscribe((user) => {
      if (user) {
        this.listService.getFollowedLists(user.id).subscribe({
          next: (data) => {
            this.listFollowingShowcase = {
              title: 'Listas de tus seguidos',
              lists: data,
            };
          },
          error: () => {
            console.error('Error al cargar listas de los usuarios seguidos');
          },
        });
      }
    });
  }
}
