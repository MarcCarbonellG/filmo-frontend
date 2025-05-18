import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, take } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { Recommendation } from '../../../movie/models/recommendation.interface';
import { MovieService } from '../../../movie/services/movie.service';
import { User } from '../../../user/models/user.interface';
import { UserService } from '../../../user/services/user.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  user$!: Observable<User | null>;
  searchTerm: string = '';
  notifications: Recommendation[] = [];
  showSearchbar: boolean = false;
  showNotisPanel: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private movieService: MovieService
  ) {}

  toggleSearchbar() {
    this.showSearchbar = !this.showSearchbar;
  }

  toggleNotisPanel() {
    this.showNotisPanel = !this.showNotisPanel;
  }

  ngOnInit(): void {
    this.user$ = this.authService.getCurrentUser();
    this.user$.subscribe(() => {
      this.loadNotifications();
    });
  }

  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.showNotisPanel = false;
    this.authService.logout();
  }

  onSearch() {
    this.router.navigate(['/search'], {
      queryParams: { query: this.searchTerm },
    });
  }

  loadNotifications() {
    this.user$.pipe(take(1)).subscribe((user) => {
      if (user) {
        this.userService.getRecommendations(user.id).subscribe({
          next: (recomendations) => {
            this.notifications = recomendations;
          },
          error: () => {
            console.error('Error al cargar notificaciones');
          },
        });
      }
    });
  }

  deleteNotification(recommendationId: string) {
    this.movieService.deleteRecommendation(recommendationId).subscribe({
      next: () => {
        const notiIndex = this.notifications.findIndex(
          (noti) => noti.id === recommendationId
        );
        if (notiIndex !== -1) {
          this.notifications.splice(notiIndex, 1);
        }
        if (this.notifications.length < 1) this.toggleNotisPanel();
      },
      error: () => {
        console.error('Error al eliminar notificación');
      },
    });
  }
}
