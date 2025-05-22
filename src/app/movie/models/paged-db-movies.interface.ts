import { DbMovie } from './db-movie';

export interface PagedDbMovies {
  page: number;
  movies: DbMovie[];
  total_pages: number;
  total_results: number;
}
