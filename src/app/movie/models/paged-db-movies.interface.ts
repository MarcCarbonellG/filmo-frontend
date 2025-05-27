import { DbMovie } from './db-movie';

export interface PagedDbMovies {
  page: number;
  movies: DbMovie[];
  totalPages: number;
  totalResults: number;
}
