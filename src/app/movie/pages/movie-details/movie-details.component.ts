import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, take } from 'rxjs';
import { User } from '../../../auth/models/user.interface';
import { AuthService } from '../../../auth/services/auth.service';
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
    this.loadReviews();
    this.reviewForm = this.fb.group({
      rating: [1, [Validators.required]],
      review: ['', []],
    });
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
                this.existingReviews = data;
              }
            } else {
              this.existingReviews = data;
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
            .addReview(
              user.id,
              user.username,
              user.avatar,
              this.movie.id,
              this.movie.title,
              this.movie.poster_path,
              this.movie.release_date,
              rating,
              review
            )
            .subscribe({
              next: (response) => {
                this.isReviewed = true;
                const newReview = response.data.movie_review;
                newReview.username = user.username;
                this.existingReviews.unshift(newReview);
                console.log('Reseña añadida con éxito');
              },
              error: (err) => {
                console.error('Error al añadir la review:', err);
              },
            });
        } else {
          console.warn('Faltan datos necesarios para añadir la review');
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
            console.log('Reseña eliminada con éxito');
          },
          error: (err) => {
            console.error('Error al eliminar la reseña:', err);
          },
        });
      } else {
        console.warn('Faltan datos necesarios para eliminar la reseña');
      }
    });
  }
}
