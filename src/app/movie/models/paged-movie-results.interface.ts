import { SimplifiedMovie } from './simplified-movie.interface';

export interface PagedMovieResults {
  page: number;
  movies: SimplifiedMovie[];
  totalPages: number;
  totalResults: number;
}
