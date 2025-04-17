import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, take } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { User } from '../../../user/models/user.interface';
import { Movie } from '../../models/movie.interface';
import { Review } from '../../models/review.interface';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movie-details',
  standalone: false,
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css',
})
export class MovieDetailsComponent implements OnInit {
  movie: Movie | null = null;
  movieId: string | null = null;
  user$!: Observable<User | null>;
  errorMessage: string | null = null;
  baseImageUrl: string;
  showReviewForm = false;
  reviewForm!: FormGroup;
  stars: number[] = [5, 4, 3, 2, 1];
  isReviewed: boolean = true;
  isInFavourites: boolean = false;
  isInWatched: boolean = false;
  favourites: number = 0;
  watched: number = 0;
  rating: number = 0;

  existingReviews: Review[] = [];

  isLoggedIn: boolean = false;

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.baseImageUrl = this.movieService.getImageBaseUrl();
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  ngOnInit(): void {
    this.user$ = this.authService.getCurrentUser();
    this.movieId = this.route.snapshot.paramMap.get('id');
    this.loadMovie();
    this.loadFavourites();
    this.loadWatched();
    this.loadReviews();
    this.reviewForm = this.fb.group({
      rating: [1, [Validators.required]],
      review: ['', []],
    });
  }

  calculateAverageRating() {
    this.rating =
      this.existingReviews.reduce((acc, review) => acc + review.rating, 0) /
      this.existingReviews.length;
  }

  loadMovie() {
    if (!this.movieId) {
      this.errorMessage = 'Error al cargar película';
    } else {
      this.movieService.getMovieById(this.movieId).subscribe({
        next: (data) => {
          this.movie = data;
        },
        error: (err) => {
          this.errorMessage = 'Error al cargar película';
        },
      });
    }
  }

  loadReviews() {
    if (!this.movieId) {
      this.errorMessage = 'Error al cargar reseñas';
    } else {
      this.movieService.getReviews(this.movieId).subscribe({
        next: (data) => {
          this.existingReviews = data;
          this.calculateAverageRating();
          this.user$.pipe(take(1)).subscribe((user) => {
            if (user) {
              const userReviewIndex = data.findIndex(
                (review) => review.user_id == user.id
              );

              if (userReviewIndex !== -1) {
                const [userReview] = data.splice(userReviewIndex, 1);
                this.existingReviews = [userReview, ...data];
              } else {
                this.isReviewed = false;
              }
            }
          });
        },
        error: () => {
          this.errorMessage = 'Error al cargar reseñas';
        },
      });
    }
  }

  toggleReviewForm(): void {
    this.showReviewForm = !this.showReviewForm;
  }

  submitReview(): void {
    if (this.reviewForm.valid) {
      const rating = this.reviewForm.value.rating;
      const review = this.reviewForm.value.review;

      this.user$.pipe(take(1)).subscribe((user) => {
        if (user && this.movie) {
          this.movieService
            .addReview(user.id, this.movie.id, rating, review)
            .subscribe({
              next: (response) => {
                this.isReviewed = true;
                const newReview = response.data.movie_review;
                newReview.username = user.username;
                this.existingReviews.unshift(newReview);
                this.calculateAverageRating();
              },
              error: (err) => {
                console.error('Error al añadir la review:', err);
              },
            });
        }
      });

      this.reviewForm.reset({ rating: 2.5, review: '' });
      this.showReviewForm = false;
    }
  }

  deleteReview() {
    this.user$.pipe(take(1)).subscribe((user) => {
      if (user && this.movie) {
        this.movieService.deleteReview(user.id, this.movie.id).subscribe({
          next: () => {
            this.isReviewed = false;
            const userReviewIndex = this.existingReviews.findIndex(
              (review) => review.user_id == user.id
            );
            this.existingReviews.splice(userReviewIndex, 1);
            this.calculateAverageRating();
          },
          error: (err) => {
            console.error('Error al eliminar la reseña:', err);
          },
        });
      }
    });
  }

  loadFavourites() {
    this.user$.pipe(take(1)).subscribe((user) => {
      if (user && this.movie) {
        this.movieService.getFavorites(this.movie.id).subscribe({
          next: (response) => {
            const favIndex = response.findIndex(
              (fav) => fav.user_id === user.id
            );
            this.isInFavourites = favIndex !== -1 ? true : false;
            this.favourites = response.length;
          },
          error: (err) => {
            console.error('Error al cargar favoritos', err);
          },
        });
      }
    });
  }

  loadWatched() {
    this.user$.pipe(take(1)).subscribe((user) => {
      if (user && this.movie) {
        this.movieService.getWatched(this.movie.id).subscribe({
          next: (response) => {
            const watchedIndex = response.findIndex(
              (watched) => watched.user_id === user.id
            );
            this.isInWatched = watchedIndex !== -1 ? true : false;
            this.watched = response.length;
          },
          error: (err) => {
            console.error('Error al cargar vistas', err);
          },
        });
      }
    });
  }

  addToFavourites() {
    this.user$.pipe(take(1)).subscribe((user) => {
      if (user && this.movie) {
        this.movieService.addToFavorites(user.id, this.movie.id).subscribe({
          next: () => {
            this.favourites++;
            this.isInFavourites = true;
          },
          error: (err) => {
            console.error('Error al añadir película a favoritos', err);
          },
        });
      }
    });
  }

  addToWatched() {
    this.user$.pipe(take(1)).subscribe((user) => {
      if (user && this.movie) {
        this.movieService.addToWatched(user.id, this.movie.id).subscribe({
          next: () => {
            this.watched++;
            this.isInWatched = true;
          },
          error: (err) => {
            console.error('Error al añadir película a vistas', err);
          },
        });
      }
    });
  }

  removeFromFavourites() {
    this.user$.pipe(take(1)).subscribe((user) => {
      if (user && this.movie) {
        this.movieService
          .removeFromFavorites(user.id, this.movie.id)
          .subscribe({
            next: () => {
              this.favourites--;
              this.isInFavourites = false;
            },
            error: (err) => {
              console.error('Error al quitar película de favoritos', err);
            },
          });
      }
    });
  }

  removeFromWatched() {
    this.user$.pipe(take(1)).subscribe((user) => {
      if (user && this.movie) {
        this.movieService.removeFromWatched(user.id, this.movie.id).subscribe({
          next: () => {
            this.watched--;
            this.isInWatched = false;
          },
          error: (err) => {
            console.error('Error al quitar película de vistas', err);
          },
        });
      }
    });
  }
}
