import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MutationResponse } from '../../models/mutation-response.interface';
import { Genre } from '../models/genre.interface';
import { Language } from '../models/language.interface';
import { MovieGenres } from '../models/movie-genres.interface';
import { Movie } from '../models/movie.interface';
import { PagedMovieResults } from '../models/paged-movie-results.interface';
import { Review } from '../models/review.interface';
import { SimplifiedMovie } from '../models/simplified-movie.interface';
import { UserMovieRelation } from '../models/user-movie-relation.interface';

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

  getMovieById(movieId: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.API_URL}/movie/${movieId}`);
  }

  searchMoviesByTitle(
    searchTerm: string,
    page: number
  ): Observable<PagedMovieResults> {
    return this.http.get<PagedMovieResults>(
      `${this.API_URL}/movie/search?query=${searchTerm}&page=${page}`
    );
  }

  getMovieCollection(collection: string): Observable<SimplifiedMovie[]> {
    return this.http.get<SimplifiedMovie[]>(
      `${this.API_URL}/movie/collection/${collection}`
    );
  }

  getPopularAmongFollowed(id: number): Observable<SimplifiedMovie[]> {
    return this.http.get<SimplifiedMovie[]>(
      `${this.API_URL}/movie/following/${id}`
    );
  }

  getGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(`${this.API_URL}/movie/genres`);
  }

  getLanguages(): Observable<Language[]> {
    return this.http.get<Language[]>(`${this.API_URL}/movie/languages`);
  }

  addReview(
    userId: number,
    movieId: number,
    rating: number,
    content: string
  ): Observable<MutationResponse> {
    return this.http.post<MutationResponse>(`${this.API_URL}/movie/review`, {
      userId,
      movieId,
      rating,
      content,
    });
  }

  deleteReview(userId: number, movieId: number): Observable<MutationResponse> {
    return this.http.delete<MutationResponse>(`${this.API_URL}/movie/review`, {
      body: { userId, movieId },
    });
  }

  getReviews(movieId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.API_URL}/movie/review/${movieId}`);
  }

  addToFavorites(
    userId: number,
    movieId: number
  ): Observable<MutationResponse> {
    return this.http.post<MutationResponse>(`${this.API_URL}/movie/fav`, {
      userId,
      movieId,
    });
  }

  removeFromFavorites(
    userId: number,
    movieId: number
  ): Observable<MutationResponse> {
    return this.http.delete<MutationResponse>(`${this.API_URL}/movie/fav`, {
      body: {
        userId,
        movieId,
      },
    });
  }

  getFavorites(movieId: number): Observable<UserMovieRelation[]> {
    return this.http.get<UserMovieRelation[]>(
      `${this.API_URL}/movie/fav/${movieId}`
    );
  }

  addToWatched(userId: number, movieId: number): Observable<MutationResponse> {
    return this.http.post<MutationResponse>(`${this.API_URL}/movie/watched`, {
      userId,
      movieId,
    });
  }

  removeFromWatched(
    userId: number,
    movieId: number
  ): Observable<MutationResponse> {
    return this.http.delete<MutationResponse>(`${this.API_URL}/movie/watched`, {
      body: {
        userId,
        movieId,
      },
    });
  }

  getWatched(movieId: number): Observable<UserMovieRelation[]> {
    return this.http.get<UserMovieRelation[]>(
      `${this.API_URL}/movie/watched/${movieId}`
    );
  }

  getMovieGenres(movieId: number): Observable<MovieGenres> {
    return this.http.get<MovieGenres>(
      `${this.API_URL}/movie/genres/${movieId}`
    );
  }

  deleteRecommendation(recommendationId: string): Observable<MutationResponse> {
    return this.http.delete<MutationResponse>(
      `${this.API_URL}/movie/recommendation`,
      {
        body: { recommendationId },
      }
    );
  }

  recommendMovie(
    recommenderId: number,
    recommendedId: number,
    movieId: number
  ): Observable<MutationResponse> {
    return this.http.post<MutationResponse>(
      `${this.API_URL}/movie/recommendation`,
      {
        recommenderId,
        recommendedId,
        movieId,
      }
    );
  }
}
