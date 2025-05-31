import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, take } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { ListWithMovieStatus } from '../../../list/models/list-with-movie-status.interface';
import { ListService } from '../../../list/services/list.service';
import { PublicUser } from '../../../user/models/public-user.interface';
import { User } from '../../../user/models/user.interface';
import { UserService } from '../../../user/services/user.service';
import { Movie } from '../../models/movie.interface';
import { Review } from '../../models/review.interface';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movie-details',
  standalone: false,
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css',
})
export class MovieDetailsComponent implements OnInit, AfterViewInit {
  @ViewChild('listDialogRef') listDialogRef!: ElementRef<HTMLDialogElement>;
  @ViewChild('friendsDialogRef')
  friendsDialogRef!: ElementRef<HTMLDialogElement>;
  @ViewChild('recDialogRef') recDialogRef!: ElementRef<HTMLDialogElement>;
  @ViewChild('delReviewRef') delReviewRef!: ElementRef<HTMLDialogElement>;
  @ViewChild('listCreatedRef') listCreatedRef!: ElementRef<HTMLDialogElement>;
  @ViewChild('listErrorRef') listErrorRef!: ElementRef<HTMLDialogElement>;
  movie: Movie | null = null;
  movieId: number | null = null;
  user$!: Observable<User | null>;
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
  friendsRating: number = 0;
  reviews: Review[] = [];
  reviewUserId: number | null = null;
  friendsReviews: Review[] = [];
  isLoggedIn: boolean = false;
  showNewListForm = false;
  userLists: ListWithMovieStatus[] = [];
  newList = {
    title: '',
    description: '',
  };
  friends: PublicUser[] = [];
  notFound: boolean = false;
  dialogs: Record<string, ElementRef<HTMLDialogElement>> = {};

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute,
    public router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private listService: ListService,
    private userService: UserService
  ) {
    this.baseImageUrl = this.movieService.getImageBaseUrl();
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  ngOnInit(): void {
    this.user$ = this.authService.getCurrentUser();
    this.movieId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadMovie();
    this.loadFavourites();
    this.loadWatched();
    this.loadFriends();
    this.loadReviews();
    this.reviewForm = this.fb.group({
      rating: [1, [Validators.required]],
      review: ['', []],
    });
  }

  ngAfterViewInit() {
    this.dialogs = {
      list: this.listDialogRef,
      friends: this.friendsDialogRef,
      rec: this.recDialogRef,
      delReview: this.delReviewRef,
      listCreated: this.listCreatedRef,
      listError: this.listErrorRef,
    };
  }

  openDialog(key: string) {
    this.dialogs[key]?.nativeElement.showModal();
  }

  closeDialog(key: string) {
    this.dialogs[key]?.nativeElement.close();
  }

  openAddListDialog() {
    this.loadUserLists();
    this.listDialogRef.nativeElement.showModal();
  }

  openDelReviewDialog(userId: number) {
    this.reviewUserId = userId;
    this.delReviewRef.nativeElement.showModal();
  }

  toggleReviewForm(): void {
    this.showReviewForm = !this.showReviewForm;
  }

  calculateAverageRating() {
    if (this.reviews.length > 0) {
      this.rating =
        this.reviews.reduce((acc, review) => acc + review.rating, 0) /
        this.reviews.length;
    } else {
      this.rating = 0;
    }
    console.log('average');
  }

  calculateFriendsRating() {
    this.friendsReviews = this.reviews.filter((review) =>
      this.friends.map((friend) => friend.id).includes(review.user_id)
    );
    if (this.friendsReviews.length > 0) {
      this.friendsRating =
        this.friendsReviews.reduce((acc, review) => acc + review.rating, 0) /
        this.friendsReviews.length;
    } else {
      this.friendsRating = 0;
    }

    console.log('friends');
  }

  loadMovie() {
    if (this.movieId) {
      this.movieService.getMovieById(this.movieId).subscribe({
        next: (data) => {
          this.movie = data;
        },
        error: (err) => {
          if (err.status === 404) {
            this.notFound = true;
          }
          console.error('Error al cargar película');
        },
      });
    }
  }

  loadReviews() {
    if (this.movieId) {
      this.movieService.getReviews(this.movieId).subscribe({
        next: (data) => {
          this.reviews = data;
          console.log('loadReview');
          this.calculateFriendsRating();
          this.calculateAverageRating();

          this.user$.pipe(take(1)).subscribe((user) => {
            if (user) {
              const userReviewIndex = data.findIndex(
                (review) => review.user_id == user.id
              );

              if (userReviewIndex !== -1) {
                const [userReview] = data.splice(userReviewIndex, 1);
                this.reviews = [userReview, ...data];
              } else {
                this.isReviewed = false;
              }
            }
          });
        },
        error: () => {
          console.error('Error al cargar reseñas');
        },
      });
    }
  }

  loadFavourites() {
    if (this.movieId) {
      this.movieService.getFavorites(this.movieId).subscribe({
        next: (response) => {
          this.favourites = response.length;

          this.user$.pipe(take(1)).subscribe((user) => {
            if (user) {
              const favIndex = response.findIndex(
                (fav) => fav.user_id === user.id
              );
              this.isInFavourites = favIndex !== -1 ? true : false;
            }
          });
        },
        error: (err) => {
          console.error('Error al cargar favoritos', err);
        },
      });
    }
  }

  loadWatched() {
    if (this.movieId) {
      this.movieService.getWatched(this.movieId).subscribe({
        next: (response) => {
          this.watched = response.length;

          this.user$.pipe(take(1)).subscribe((user) => {
            if (user) {
              const watchedIndex = response.findIndex(
                (watched) => watched.user_id === user.id
              );
              this.isInWatched = watchedIndex !== -1 ? true : false;
            }
          });
        },
        error: (err) => {
          console.error('Error al cargar vistas', err);
        },
      });
    }
  }

  loadFriends() {
    this.user$.pipe(take(1)).subscribe((user) => {
      if (user) {
        this.userService.getFriendsById(user.id).subscribe({
          next: (response) => {
            this.friends = response;
          },
          error: (err) => {
            console.error('Error al cargar amigos', err);
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
                console.log(response.data.movie_review);
                const newReview = response.data.movie_review;
                newReview.username = user.username;
                newReview.avatar = user.avatar;
                const reviews = [...this.reviews];
                reviews.unshift(newReview);
                this.reviews = reviews;

                this.calculateAverageRating();
              },
              error: (err) => {
                console.error('Error al añadir la review:', err);
              },
            });
        }
      });

      this.reviewForm.reset({ rating: 3, review: '' });
      this.showReviewForm = false;
    }
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
              this.newList = { title: '', description: '' };
              this.showNewListForm = false;
              this.closeDialog('list');
              this.openDialog('listCreated');
            },
            error: (err) => {
              this.openDialog('listError');
              console.error('Error al crear lista', err);
            },
          });
      }
    });
  }

  recommendMovie(userId: number) {
    this.user$.pipe(take(1)).subscribe((user) => {
      if (user && this.movieId) {
        this.movieService
          .recommendMovie(user.id, userId, this.movieId)
          .subscribe({
            next: () => {
              this.closeDialog('rec');
            },
            error: (err: any) => {
              console.error('Error al recomendar película', err);
            },
          });
      }
    });
  }

  deleteReview() {
    if (this.reviewUserId && this.movieId) {
      this.movieService
        .deleteReview(this.reviewUserId, this.movieId)
        .subscribe({
          next: () => {
            this.isReviewed = false;
            const userReviewIndex = this.reviews.findIndex(
              (review) => review.user_id == this.reviewUserId
            );
            this.reviews.splice(userReviewIndex, 1);
            this.calculateAverageRating();
          },
          error: (err) => {
            console.error('Error al eliminar la reseña:', err);
          },
        });
    }
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
