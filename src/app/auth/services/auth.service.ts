import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LocalStorageService } from '../../services/local-storage.service';
import { clearUser } from '../../store/user/user.actions';
import { selectUser } from '../../store/user/user.selectors';
import { User } from '../models/user.interface';

interface LoginResponse {
  token: string;
  message: string;
  user: any;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_URL = environment.API_URL;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private store: Store
  ) {}

  getCurrentUser(): Observable<User | null> {
    return this.store.select(selectUser);
  }

  getToken(): string | null {
    return this.localStorageService.getFromLocalStorage('auth_token');
  }

  setToken(token: string): void {
    this.localStorageService.saveToLocalStorage('auth_token', token);
  }

  clearToken(): void {
    this.localStorageService.removeFromLocalStorage('auth_token');
  }

  register(
    email: string,
    username: string,
    password: string
  ): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/register`, {
      email,
      username,
      password,
    });
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, {
      username,
      password,
    });
  }

  logout() {
    this.store.dispatch(clearUser());
    this.clearToken();
  }

  isAuthenticated(): boolean {
    return !!this.localStorageService.getFromLocalStorage('auth_token');
  }
}
