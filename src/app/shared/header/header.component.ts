import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { User } from '../../user/models/user.interface';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  user$!: Observable<User | null>;
  searchTerm: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.user$ = this.authService.getCurrentUser();
  }

  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
  }

  onSearch() {
    this.router.navigate(['/search'], {
      queryParams: { query: this.searchTerm },
    });
  }
}
