import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DbMovie } from '../../movie/models/db-movie';
import { Following } from '../models/following.interface';
import { PublicUser } from '../models/public-user.interface';

// Interfaz para peticiones de modificación de la base de datos (creación o eliminación)
interface MutationResponse {
  message: string;
  data: any;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private API_URL = environment.API_URL;

  constructor(private http: HttpClient) {}

  getUserByUsername(username: string): Observable<PublicUser> {
    return this.http.get<PublicUser>(`${this.API_URL}/user/${username}`);
  }

  getFavoritesByUsername(username: string): Observable<DbMovie[]> {
    return this.http.get<DbMovie[]>(
      `${this.API_URL}/user/profile/fav/${username}`
    );
  }

  getWatchedByUsername(username: string): Observable<DbMovie[]> {
    return this.http.get<DbMovie[]>(
      `${this.API_URL}/user/profile/watched/${username}`
    );
  }

  getFollowersById(user_id: number): Observable<Following[]> {
    return this.http.get<Following[]>(
      `${this.API_URL}/user/profile/followers/${user_id}`
    );
  }

  getFollowedById(user_id: number): Observable<Following[]> {
    return this.http.get<Following[]>(
      `${this.API_URL}/user/profile/followed/${user_id}`
    );
  }

  getFollowing(
    follower_id: number,
    followed_id: number
  ): Observable<Following> {
    return this.http.get<Following>(
      `${this.API_URL}/user/profile/following?follower_id=${follower_id}&followed_id=${followed_id}`
    );
  }

  follow(
    follower_id: number,
    followed_id: number
  ): Observable<MutationResponse> {
    return this.http.post<MutationResponse>(
      `${this.API_URL}/user/profile/follow`,
      {
        follower_id,
        followed_id,
      }
    );
  }

  unfollow(
    follower_id: number,
    followed_id: number
  ): Observable<MutationResponse> {
    return this.http.delete<MutationResponse>(
      `${this.API_URL}/user/profile/unfollow`,
      {
        body: {
          follower_id,
          followed_id,
        },
      }
    );
  }
}
