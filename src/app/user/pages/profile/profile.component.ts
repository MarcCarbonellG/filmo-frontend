import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, take } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { DbMovie } from '../../../movie/models/db-movie';
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
  user$!: Observable<User | null>;
  user!: PublicUser | User | null;
  errorMessage: string = '';
  favorites: DbMovie[] = [];
  watched: DbMovie[] = [];
  followers: number = 0;
  followed: number = 0;
  isFollowedByUser: boolean = false;
  baseImageUrl: string;

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
        this.errorMessage = 'Error al cargar datos de perfil';
      }
    });
  }

  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  loadProfile(profileUsername: string) {
    this.loadUserData(profileUsername);
    this.loadFavorites();
    this.loadWatched();
    this.loadFollowers();
    this.loadFollowed();
    this.user$.pipe(take(1)).subscribe((user) => {
      if (String(user?.username) !== profileUsername) {
        this.loadFollowingRelationship();
      }
    });
  }

  loadUserData(username: string): void {
    this.user$.pipe(take(1)).subscribe((user) => {
      if (String(user?.username) === username) {
        this.user = user;
      } else {
        this.userService.getUserByUsername(username).subscribe({
          next: (response) => {
            this.user = response;
          },
          error: () => {
            this.errorMessage = 'Error al obtener datos de usuario';
          },
        });
      }
    });
  }

  loadFavorites(): void {
    if (this.user) {
      this.userService.getFavoritesByUsername(this.user.username).subscribe({
        next: (response) => {
          this.favorites = response;
        },
        error: () => {
          this.errorMessage = 'Error al obtener películas favoritas';
        },
      });
    }
  }

  loadWatched(): void {
    if (this.user) {
      this.userService.getWatchedByUsername(this.user.username).subscribe({
        next: (response) => {
          this.watched = response;
        },
        error: () => {
          this.errorMessage = 'Error al obtener películas vistas';
        },
      });
    }
  }

  loadFollowers() {
    if (this.user) {
      this.userService.getFollowersById(this.user.id).subscribe({
        next: (response) => {
          this.followers = response.length;
        },
        error: () => {
          this.errorMessage = 'Error al cargar seguidores';
        },
      });
    }
  }

  loadFollowed() {
    if (this.user) {
      this.userService.getFollowedById(this.user.id).subscribe({
        next: (response) => {
          this.followed = response.length;
        },
        error: () => {
          this.errorMessage = 'Error al cargar seguidos';
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
            this.errorMessage = 'Error al comporbar estado de seguimiento';
          },
        });
      }
    });
  }

  follow() {
    this.user$.pipe(take(1)).subscribe((user) => {
      if (user && this.user) {
        this.userService.follow(user.id, this.user.id).subscribe({
          next: () => {
            this.followers++;
            this.isFollowedByUser = true;
          },
          error: () => {
            this.errorMessage = 'Error al comporbar estado de seguimiento';
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
            this.followers--;
            this.isFollowedByUser = false;
          },
          error: () => {
            this.errorMessage = 'Error al comporbar estado de seguimiento';
          },
        });
      }
    });
  }

  deleteAccount() {
    const confirmed = confirm(
      '¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.'
    );

    if (confirmed && this.user) {
      this.userService.deleteAccount(this.user.id).subscribe({
        next: () => {
          alert('Cuenta eliminada correctamente.');
          this.authService.logout();
          this.router.navigate(['/']);
        },
        error: () => {
          alert('Hubo un problema al eliminar la cuenta. Inténtalo de nuevo.');
        },
      });
    }
  }
}
