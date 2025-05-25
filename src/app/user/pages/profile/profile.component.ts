import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, map, Observable, switchMap, take } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { PagedLists } from '../../../list/models/paged-lists.interface';
import { MovieGenres } from '../../../movie/models/movie-genres.interface';
import { PagedDbMovies } from '../../../movie/models/paged-db-movies.interface';
import { Review } from '../../../movie/models/review.interface';
import { MovieService } from '../../../movie/services/movie.service';
import { PublicUser } from '../../models/public-user.interface';
import { User } from '../../models/user.interface';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  @ViewChild('followersDialogRef')
  followersRef!: ElementRef<HTMLDialogElement>;
  @ViewChild('followedDialogRef')
  followedRef!: ElementRef<HTMLDialogElement>;
  @ViewChild('delAccountRef')
  delAccountRef!: ElementRef<HTMLDialogElement>;
  @ViewChild('delSuccessRef') delSuccessRef!: ElementRef<HTMLDialogElement>;
  @ViewChild('delErrorRef') delErrorRef!: ElementRef<HTMLDialogElement>;
  user$!: Observable<User | null>;
  user!: PublicUser | User | null;
  favorites!: PagedDbMovies;
  watched!: PagedDbMovies;
  lists!: PagedLists;
  followers: PublicUser[] = [];
  followed: PublicUser[] = [];
  isFollowedByUser: boolean = false;
  baseImageUrl: string;
  matchPercentage: number = 0;
  commonFavGenres: string[] = [];
  tab: 'w' | 'f' | 'l' = 'w';
  scale: number = 0.8;

  constructor(
    private authService: AuthService,
    public route: ActivatedRoute,
    private userService: UserService,
    private movieService: MovieService,
    private router: Router
  ) {
    this.user$ = this.authService.getCurrentUser();
    this.baseImageUrl = this.movieService.getImageBaseUrl();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const profileUsername = params.get('username');
      if (profileUsername) {
        this.loadProfile(profileUsername);
      } else {
        console.error('Error al cargar datos de perfil');
      }
    });
    window.addEventListener('resize', () => {
      this.setScale(window.innerWidth);
    });
  }

  openFollowersDialog() {
    this.followersRef.nativeElement.showModal();
  }

  closeFollowersDialog() {
    this.followersRef.nativeElement.close();
  }

  openFollowedDialog() {
    this.followedRef.nativeElement.showModal();
  }

  closeFollowedDialog() {
    this.followedRef.nativeElement.close();
  }

  openDelAccountDialog() {
    this.delAccountRef.nativeElement.showModal();
  }

  closeDelAccountDialog() {
    this.delAccountRef.nativeElement.close();
  }

  openDelSuccessDialog() {
    this.delSuccessRef.nativeElement.showModal();
  }

  closeDelSuccessDialog() {
    this.delSuccessRef.nativeElement.close();
    this.router.navigate(['/']);
  }

  openDelErrorDialog() {
    this.delErrorRef.nativeElement.showModal();
  }

  closeDelErrorDialog() {
    this.delErrorRef.nativeElement.close();
  }

  setScale(width: number) {
    if (width < 640) {
      this.scale = 0.8;
    } else {
      this.scale = 1;
    }
  }

  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  changeTab(newTab: 'w' | 'f' | 'l') {
    this.tab = newTab;
  }

  goToPageFav(page: number) {
    this.loadFavorites(page);
  }

  goToPageWatched(page: number) {
    this.loadWatched(page);
  }

  goToPageLists(page: number) {
    this.loadLists(page);
  }

  loadProfile(profileUsername: string): void {
    this.userService.getUserByUsername(profileUsername).subscribe({
      next: (response) => {
        this.user = response;
        this.loadUserData(profileUsername);
      },
      error: () => {
        console.error('Error al obtener datos de usuario');
      },
    });
  }

  loadUserData(profileUsername: string) {
    this.loadFavorites();
    this.loadWatched();
    this.loadLists();
    this.loadFollowers();
    this.loadFollowed();
    this.loadTasteMatch();
    this.user$.pipe(take(1)).subscribe((user) => {
      if (String(user?.username) !== profileUsername) {
        this.loadFollowingRelationship();
      }
    });
  }

  loadFavorites(page?: number): void {
    if (this.user) {
      this.userService
        .getFavoritesByUsername(this.user.username, page ?? undefined)
        .subscribe({
          next: (response) => {
            this.favorites = response;
          },
          error: () => {
            console.error('Error al obtener películas favoritas');
          },
        });
    }
  }

  loadWatched(page?: number): void {
    if (this.user) {
      this.userService
        .getWatchedByUsername(this.user.username, page ?? undefined)
        .subscribe({
          next: (response) => {
            this.watched = response;
          },
          error: () => {
            console.error('Error al obtener películas vistas');
          },
        });
    }
  }

  loadLists(page?: number): void {
    this.user$.pipe(take(1)).subscribe((user) => {
      if (this.user && user && String(this.user.username) === user.username) {
        this.loadOwnAndSavedLists(page);
      } else {
        this.loadOwnLists(page);
      }
    });
  }

  loadOwnLists(page?: number) {
    if (this.user) {
      this.userService
        .getListsByUsername(this.user.username, page ?? undefined)
        .subscribe({
          next: (response) => {
            this.lists = response;
          },
          error: () => {
            console.error('Error al obtener listas');
          },
        });
    }
  }

  loadOwnAndSavedLists(page?: number) {
    if (this.user) {
      this.userService
        .getProfileLists(this.user.username, page ?? undefined)
        .subscribe({
          next: (response) => {
            this.lists = response;
          },
          error: () => {
            console.error('Error al obtener listas');
          },
        });
    }
  }

  loadFollowers() {
    if (this.user) {
      this.userService.getFollowersById(this.user.id).subscribe({
        next: (response) => {
          this.followers = response;
        },
        error: () => {
          console.error('Error al cargar seguidores');
        },
      });
    }
  }

  loadFollowed() {
    if (this.user) {
      this.userService.getFollowedById(this.user.id).subscribe({
        next: (response) => {
          this.followed = response;
        },
        error: () => {
          console.error('Error al cargar seguidos');
        },
      });
    }
  }

  loadFollowingRelationship() {
    this.user$.pipe(take(1)).subscribe((user) => {
      if (user && this.user) {
        this.userService.getFollowing(user.id, this.user.id).subscribe({
          next: (response) => {
            this.isFollowedByUser = response ? true : false;
          },
          error: () => {
            console.error('Error al comporbar estado de seguimiento');
          },
        });
      }
    });
  }

  loadReviews(): Observable<{
    userReviews: Review[];
    profileReviews: Review[];
  }> {
    return this.user$.pipe(
      take(1),
      switchMap((user) => {
        if (!user || !this.user) {
          throw new Error('Usuario no disponible');
        }

        return forkJoin({
          userReviews: this.userService.getReviews(user.id),
          profileReviews: this.userService.getReviews(this.user.id),
        });
      })
    );
  }

  loadMovieGenresForReviews(reviews: Review[]): Observable<MovieGenres[]> {
    const genreCalls = reviews.map((review) =>
      this.movieService.getMovieGenres(review.movie_id)
    );

    return forkJoin(genreCalls);
  }

  loadCommonFavoriteGenres(user1Reviews: Review[], user2Reviews: Review[]) {
    const user1Genres$ = this.loadMovieGenresForReviews(user1Reviews);
    const user2Genres$ = this.loadMovieGenresForReviews(user2Reviews);

    return forkJoin([user1Genres$, user2Genres$]).pipe(
      map(([user1Genres, user2Genres]) => {
        const user1Pref = this.userService.getGenrePreferences(
          user1Reviews,
          user1Genres
        );
        const user2Pref = this.userService.getGenrePreferences(
          user2Reviews,
          user2Genres
        );
        return this.userService.getCommonFavoriteGenres(user1Pref, user2Pref);
      })
    );
  }

  loadTasteMatch() {
    this.loadReviews().subscribe({
      next: ({ userReviews, profileReviews }) => {
        this.matchPercentage = this.userService.calculateTasteMatch(
          userReviews,
          profileReviews
        );
        this.loadCommonFavoriteGenres(userReviews, profileReviews).subscribe(
          (result) => {
            this.commonFavGenres = result;
          }
        );
      },
      error: () => {
        console.error('Error al obtener las reseñas');
      },
    });
  }

  follow() {
    this.user$.pipe(take(1)).subscribe((user) => {
      if (user && this.user) {
        this.userService.follow(user.id, this.user.id).subscribe({
          next: () => {
            this.followers.push({
              id: user.id,
              username: user.username,
              avatar: user.avatar,
              is_admin: user.is_admin,
            });
            this.isFollowedByUser = true;
          },
          error: () => {
            console.error('Error al comporbar estado de seguimiento');
          },
        });
      }
    });
  }

  unfollow() {
    this.user$.pipe(take(1)).subscribe((user) => {
      if (user && this.user) {
        this.userService.unfollow(user.id, this.user.id).subscribe({
          next: () => {
            const followerIndex = this.followers.findIndex(
              (follower) => follower.id === user.id
            );
            if (followerIndex !== -1) {
              this.followers.slice(followerIndex, 1);
            }
            this.isFollowedByUser = false;
          },
          error: () => {
            console.error('Error al comporbar estado de seguimiento');
          },
        });
      }
    });
  }

  deleteAccount() {
    if (this.user) {
      this.userService.deleteAccount(this.user.id).subscribe({
        next: () => {
          this.openDelSuccessDialog();
          this.authService.logout();
        },
        error: () => {
          this.openDelErrorDialog();
        },
      });
    }
  }
}
