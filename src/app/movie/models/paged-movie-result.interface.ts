import { SimplifiedMovie } from './simplified-movie.interface';

export interface PagedMovieResult {
  page: number;
  movies: SimplifiedMovie[];
  total_pages: number;
  total_results: number;
}
