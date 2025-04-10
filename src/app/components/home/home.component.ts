import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { ApiService } from '../../services/api.service';
import { User } from '../../store/user/user.reducer';
import { selectUser } from '../../store/user/user.selectors';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  user$: Observable<User | null>;
  apiUrl = environment.API_URL;
  message = 'Cargando...';
  dbMessage = 'Verificando conexión...';

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private store: Store
  ) {
    this.user$ = this.store.select(selectUser);
  }

  logout() {
    this.authService.logout();
  }

  ngOnInit() {
    // Prueba del backend
    this.apiService.getHello().subscribe((res) => (this.message = res));

    // Prueba de la base de datos
    this.apiService.testDb().subscribe(
      (res) => (this.dbMessage = `DB Connected: ${res.time}`),
      (err) => (this.dbMessage = 'Error al conectar con DB')
    );
  }
}
