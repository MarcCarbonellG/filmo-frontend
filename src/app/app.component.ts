import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  message = 'Cargando...';
  dbMessage = 'Verificando conexión...';

  constructor(private apiService: ApiService) {}

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
