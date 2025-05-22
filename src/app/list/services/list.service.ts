import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MutationResponse } from '../../models/mutation-response.interface';
import { ListWithMovieStatus } from '../models/list-with-movie-status.interface';
import { List } from '../models/list.interface';

// Interfaz para relaciones entre un usuario y una lista
interface UserListRelation {
  user_id: number;
  list_id: number;
}

@Injectable({
  providedIn: 'root',
})
export class ListService {
  private API_URL = environment.API_URL;

  constructor(private http: HttpClient) {}

  createList(
    userId: number,
    title: string,
    movieId: string,
    description?: string
  ): Observable<MutationResponse> {
    return this.http.post<MutationResponse>(`${this.API_URL}/list`, {
      userId,
      title,
      description,
      movieId,
    });
  }

  getUserListsWithMovieStatus(
    userId: number,
    movieId: string
  ): Observable<ListWithMovieStatus[]> {
    return this.http.get<ListWithMovieStatus[]>(
      `${this.API_URL}/list?userId=${userId}&movieId=${movieId}`
    );
  }

  addToList(listId: number, movieId: string): Observable<MutationResponse> {
    return this.http.post<MutationResponse>(`${this.API_URL}/list/movie`, {
      listId,
      movieId,
    });
  }

  removeFromList(
    listId: number,
    movieId: number
  ): Observable<MutationResponse> {
    return this.http.delete<MutationResponse>(`${this.API_URL}/list/movie`, {
      body: {
        listId,
        movieId,
      },
    });
  }

  getListById(listId: string, page?: number): Observable<List> {
    return this.http.get<List>(
      `${this.API_URL}/list/${listId}${page ? '?page=' + page : ''}`
    );
  }

  getSaved(userId: number, listId: string): Observable<UserListRelation> {
    return this.http.get<UserListRelation>(
      `${this.API_URL}/list/saved?userId=${userId}&listId=${listId}`
    );
  }

  saveList(userId: number, listId: string): Observable<MutationResponse> {
    return this.http.post<MutationResponse>(`${this.API_URL}/list/saved`, {
      userId,
      listId,
    });
  }

  removeFromSaved(
    userId: number,
    listId: string
  ): Observable<MutationResponse> {
    return this.http.delete<MutationResponse>(`${this.API_URL}/list/saved`, {
      body: {
        userId,
        listId,
      },
    });
  }

  editList(
    listId: string,
    title: string,
    description: string
  ): Observable<List> {
    return this.http.put<List>(`${this.API_URL}/list/${listId}`, {
      title,
      description,
    });
  }

  deleteList(listId: string): Observable<List> {
    return this.http.delete<List>(`${this.API_URL}/list/${listId}`);
  }

  getPopularLists(): Observable<List[]> {
    return this.http.get<List[]>(`${this.API_URL}/list/popular`);
  }

  getFollowedLists(userId: number): Observable<List[]> {
    return this.http.get<List[]>(`${this.API_URL}/list/followed/${userId}`);
  }
}
