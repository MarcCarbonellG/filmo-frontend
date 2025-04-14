import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Genre } from '../models/genre.interface';
import { Language } from '../models/language.interface';
import { MovieList } from '../models/movie-list.interface';
import { Movie } from '../models/movie.interface';
import { Review } from '../models/review.interface';
import { SimplifiedMovie } from '../models/simplified-movie.interface';

interface DefaultResponse {
  message: string;
  data: any;
}

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

  getMovieById(movieId: string): Observable<Movie> {
    return this.http.get<Movie>(`${this.API_URL}/movie/${movieId}`);
  }

  searchMoviesByTitle(searchTerm: string) {
    return this.http.get<SimplifiedMovie[]>(
      `${this.API_URL}/movie/search?query=${searchTerm}`
    );
  }

  getMovieList(listName: string): Observable<MovieList> {
    return this.http.get<MovieList>(`${this.API_URL}/movie/list/${listName}`);
  }

  getGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(`${this.API_URL}/movie/genres`);
  }

  getLanguages(): Observable<Language[]> {
    return this.http.get<Language[]>(`${this.API_URL}/movie/languages`);
  }

  addReview(
    user_id: number,
    username: string,
    avatar: string,
    movie_id: string,
    title: string,
    poster: string,
    release_date: string,
    rating: number,
    content: string
  ): Observable<DefaultResponse> {
    return this.http.post<DefaultResponse>(`${this.API_URL}/movie/review`, {
      user_id,
      username,
      avatar,
      movie_id,
      title,
      poster,
      release_date,
      rating,
      content,
    });
  }

  deleteReview(user_id: number, movie_id: string): Observable<DefaultResponse> {
    return this.http.delete<DefaultResponse>(`${this.API_URL}/movie/review`, {
      body: { user_id, movie_id },
    });
  }

  getReviews(movie_id: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.API_URL}/movie/review/${movie_id}`);
  }
}
