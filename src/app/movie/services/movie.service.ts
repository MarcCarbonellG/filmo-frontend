import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MovieList } from '../models/movie-list.interface';
import { Movie } from '../models/movie.interface';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private API_URL = environment.API_URL;
  private readonly IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

  constructor(private http: HttpClient) {}

  getImageBaseUrl(): string {
    return this.IMAGE_BASE_URL;
  }

  getMovie(movieId: string): Observable<Movie> {
    return this.http.get<Movie>(`${this.API_URL}/movie/${movieId}`);
  }

  getMovieList(listName: string): Observable<MovieList> {
    return this.http.get<MovieList>(`${this.API_URL}/movie/list/${listName}`);
  }
}
