import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MutationResponse } from '../../models/mutation-response.interface';
import { Genre } from '../models/genre.interface';
import { Language } from '../models/language.interface';
import { MovieGenres } from '../models/movie-genres.interface';
import { Movie } from '../models/movie.interface';
import { Review } from '../models/review.interface';
import { SimplifiedMovie } from '../models/simplified-movie.interface';

// Interfaz para relaciones entre un usuario y una película (favoritos y vista)
interface UserMovieRelation {
  user_id: number;
  movie_id: number;
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
    user_id: number,
    movie_id: string,
    rating: number,
    content: string
  ): Observable<MutationResponse> {
    return this.http.post<MutationResponse>(`${this.API_URL}/movie/review`, {
      user_id,
      movie_id,
      rating,
      content,
    });
  }

  deleteReview(
    user_id: number,
    movie_id: string
  ): Observable<MutationResponse> {
    return this.http.delete<MutationResponse>(`${this.API_URL}/movie/review`, {
      body: { user_id, movie_id },
    });
  }

  getReviews(movie_id: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.API_URL}/movie/review/${movie_id}`);
  }

  addToFavorites(
    user_id: number,
    movie_id: string
  ): Observable<MutationResponse> {
    return this.http.post<MutationResponse>(`${this.API_URL}/movie/fav`, {
      user_id,
      movie_id,
    });
  }

  removeFromFavorites(
    user_id: number,
    movie_id: string
  ): Observable<MutationResponse> {
    return this.http.delete<MutationResponse>(`${this.API_URL}/movie/fav`, {
      body: {
        user_id,
        movie_id,
      },
    });
  }

  getFavorites(movie_id: string): Observable<UserMovieRelation[]> {
    return this.http.get<UserMovieRelation[]>(
      `${this.API_URL}/movie/fav/${movie_id}`
    );
  }

  addToWatched(
    user_id: number,
    movie_id: string
  ): Observable<MutationResponse> {
    return this.http.post<MutationResponse>(`${this.API_URL}/movie/watched`, {
      user_id,
      movie_id,
    });
  }

  removeFromWatched(
    user_id: number,
    movie_id: string
  ): Observable<MutationResponse> {
    return this.http.delete<MutationResponse>(`${this.API_URL}/movie/watched`, {
      body: {
        user_id,
        movie_id,
      },
    });
  }

  getWatched(movie_id: string): Observable<UserMovieRelation[]> {
    return this.http.get<UserMovieRelation[]>(
      `${this.API_URL}/movie/watched/${movie_id}`
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
    movieId: string
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
