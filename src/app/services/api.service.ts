import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getHello(): Observable<any> {
    return this.http.get(`${this.apiUrl}`, { responseType: 'text' });
  }

  testDb(): Observable<any> {
    return this.http.get(`${this.apiUrl}/db-test`);
  }
}
