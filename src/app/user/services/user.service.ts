import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedLists } from '../../list/models/paged-lists.interface';
import { MutationResponse } from '../../models/mutation-response.interface';
import { MovieGenres } from '../../movie/models/movie-genres.interface';
import { PagedDbMovies } from '../../movie/models/paged-db-movies.interface';
import { Recommendation } from '../../movie/models/recommendation.interface';
import { Review } from '../../movie/models/review.interface';
import { Following } from '../models/following.interface';
import { PublicUser } from '../models/public-user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private API_URL = environment.API_URL;

  constructor(private http: HttpClient) {}

  getUserByUsername(username: string): Observable<PublicUser> {
    return this.http.get<PublicUser>(`${this.API_URL}/user/${username}`);
  }

  getFavoritesByUsername(
    username: string,
    page?: number
  ): Observable<PagedDbMovies> {
    return this.http.get<PagedDbMovies>(
      `${this.API_URL}/user/profile/fav/${username}${
        page ? '?page=' + page : ''
      }`
    );
  }

  getWatchedByUsername(
    username: string,
    page?: number
  ): Observable<PagedDbMovies> {
    return this.http.get<PagedDbMovies>(
      `${this.API_URL}/user/profile/watched/${username}${
        page ? '?page=' + page : ''
      }`
    );
  }

  getListsByUsername(username: string, page?: number): Observable<PagedLists> {
    return this.http.get<PagedLists>(
      `${this.API_URL}/user/profile/lists/${username}${
        page ? '?page=' + page : ''
      }`
    );
  }

  getProfileLists(username: string, page?: number): Observable<PagedLists> {
    return this.http.get<PagedLists>(
      `${this.API_URL}/user/profile/lists/all/${username}${
        page ? '?page=' + page : ''
      }`
    );
  }

  getFollowersById(userId: number): Observable<PublicUser[]> {
    return this.http.get<PublicUser[]>(
      `${this.API_URL}/user/profile/followers/${userId}`
    );
  }

  getFollowedById(userId: number): Observable<PublicUser[]> {
    return this.http.get<PublicUser[]>(
      `${this.API_URL}/user/profile/followed/${userId}`
    );
  }

  getFriendsById(userId: number): Observable<PublicUser[]> {
    return this.http.get<PublicUser[]>(
      `${this.API_URL}/user/profile/friends/${userId}`
    );
  }

  getFollowing(followerId: number, followedId: number): Observable<Following> {
    return this.http.get<Following>(
      `${this.API_URL}/user/profile/following?followerId=${followerId}&followedId=${followedId}`
    );
  }

  follow(followerId: number, followedId: number): Observable<MutationResponse> {
    return this.http.post<MutationResponse>(
      `${this.API_URL}/user/profile/follow`,
      {
        followerId,
        followedId,
      }
    );
  }

  unfollow(
    followerId: number,
    followedId: number
  ): Observable<MutationResponse> {
    return this.http.delete<MutationResponse>(
      `${this.API_URL}/user/profile/unfollow`,
      {
        body: {
          followerId,
          followedId,
        },
      }
    );
  }

  deleteAccount(userId: number): Observable<MutationResponse> {
    return this.http.delete<MutationResponse>(`${this.API_URL}/user/${userId}`);
  }

  getReviews(userId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.API_URL}/user/reviews/${userId}`);
  }

  getRecommendations(userId: number): Observable<Recommendation[]> {
    return this.http.get<Recommendation[]>(
      `${this.API_URL}/user/recommendations/${userId}`
    );
  }

  calculateTasteMatch(user1: Review[], user2: Review[]): number {
    const common = user1.filter((r1) =>
      user2.some((r2) => r2.movie_id === r1.movie_id)
    );
    const n = common.length;
    if (n === 0) return 0;

    const ratings1 = common.map((r) => r.rating);
    const ratings2 = common.map(
      (r) => user2.find((r2) => r2.movie_id === r.movie_id)!.rating
    );

    const avg1 = ratings1.reduce((a, b) => a + b) / n;
    const avg2 = ratings2.reduce((a, b) => a + b) / n;

    const numerator = ratings1.reduce(
      (sum, r, i) => sum + (r - avg1) * (ratings2[i] - avg2),
      0
    );

    const denom1 = Math.sqrt(
      ratings1.reduce((sum, r) => sum + (r - avg1) ** 2, 0)
    );
    const denom2 = Math.sqrt(
      ratings2.reduce((sum, r) => sum + (r - avg2) ** 2, 0)
    );

    if (denom1 === 0 || denom2 === 0) return 0;

    const pearson = numerator / (denom1 * denom2);

    return Math.round(((pearson + 1) / 2) * 100);
  }

  getGenrePreferences(
    reviews: Review[],
    moviesGenres: MovieGenres[]
  ): Record<string, number> {
    const genreScores: Record<string, { total: number; count: number }> = {};

    reviews.forEach(({ movie_id, rating }) => {
      const movie = moviesGenres.find((movie) => +movie.id === movie_id);
      if (!movie) return;

      movie.genres.forEach((genre) => {
        if (!genreScores[genre.name])
          genreScores[genre.name] = { total: 0, count: 0 };
        genreScores[genre.name].total += rating;
        genreScores[genre.name].count += 1;
      });
    });

    const avgScores: Record<string, number> = {};
    for (const genre in genreScores) {
      const { total, count } = genreScores[genre];
      avgScores[genre] = total / count;
    }

    return avgScores;
  }

  getCommonFavoriteGenres(
    user1Prefs: Record<string, number>,
    user2Prefs: Record<string, number>
  ): string[] {
    const commonGenres = Object.keys(user1Prefs).filter(
      (genre) => genre in user2Prefs
    );

    return commonGenres
      .filter((genre) => user1Prefs[genre] >= 4 && user2Prefs[genre] >= 4)
      .sort((a, b) => {
        const avgA = (user1Prefs[a] + user2Prefs[a]) / 2;
        const avgB = (user1Prefs[b] + user2Prefs[b]) / 2;
        return avgB - avgA;
      });
  }
}
