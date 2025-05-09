import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, take } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { ListWithMovieStatus } from '../../../list/models/list-with-movie-status.interface';
import { ListService } from '../../../list/services/list.service';
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
  @ViewChild('dialogRef') dialogRef!: ElementRef<HTMLDialogElement>;
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
  showNewListForm = false;
  userLists: ListWithMovieStatus[] = [];
  newList = {
    title: '',
    description: '',
  };

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private listService: ListService
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
    if (this.existingReviews.length > 0) {
      this.rating =
        this.existingReviews.reduce((acc, review) => acc + review.rating, 0) /
        this.existingReviews.length;
    } else {
      this.rating = 0;
    }
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
        if (user && this.movieId) {
          this.movieService
            .addReview(user.id, this.movieId, rating, review)
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
      if (user && this.movieId) {
        this.movieService.deleteReview(user.id, this.movieId).subscribe({
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
      if (user && this.movieId) {
        this.movieService.getFavorites(this.movieId).subscribe({
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
      if (user && this.movieId) {
        this.movieService.getWatched(this.movieId).subscribe({
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
      if (user && this.movieId) {
        this.movieService.addToFavorites(user.id, this.movieId).subscribe({
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
      if (user && this.movieId) {
        this.movieService.addToWatched(user.id, this.movieId).subscribe({
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
      if (user && this.movieId) {
        this.movieService.removeFromFavorites(user.id, this.movieId).subscribe({
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
      if (user && this.movieId) {
        this.movieService.removeFromWatched(user.id, this.movieId).subscribe({
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

  loadUserLists() {
    this.user$.pipe(take(1)).subscribe((user) => {
      if (user && this.movieId) {
        this.listService
          .getUserListsWithMovieStatus(user.id, this.movieId)
          .subscribe({
            next: (response) => {
              this.userLists = response;
            },
            error: (err) => {
              console.error('Error al cargar listas', err);
            },
          });
      }
    });
  }

  openAddListDialog() {
    this.loadUserLists();
    this.dialogRef.nativeElement.showModal();
  }

  closeAddListDialog() {
    this.dialogRef.nativeElement.close();
  }

  createList() {
    if (!this.newList.title) return;

    this.user$.pipe(take(1)).subscribe((user) => {
      if (user && this.movieId) {
        this.listService
          .createList(
            user.id,
            this.newList.title,
            this.movieId,
            this.newList.description
          )
          .subscribe({
            next: (response) => {
              alert('Lista creada con éxito');
              this.newList = { title: '', description: '' };
              this.showNewListForm = false;
              this.closeAddListDialog();
            },
            error: (err) => {
              console.error('Error al crear lista', err);
            },
          });
      }
    });
  }

  addToList(listId: number) {
    if (this.movieId) {
      this.listService.addToList(listId, this.movieId).subscribe({
        next: () => {
          const list = this.userLists.find((list) => list.id === listId);
          if (list) {
            list.has_movie = true;
          }
        },
        error: (err) => {
          console.error('Error al añadir película a lista', err);
        },
      });
    }
  }

  removeFromList(listId: number) {
    if (this.movieId) {
      this.listService.removeFromList(listId, +this.movieId).subscribe({
        next: () => {
          const list = this.userLists.find((list) => list.id === listId);
          if (list) {
            list.has_movie = false;
          }
        },
        error: (err) => {
          console.error('Error al quitar película de lista', err);
        },
      });
    }
  }
}
