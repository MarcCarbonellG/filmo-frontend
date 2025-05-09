import { SimplifiedMovie } from './simplified-movie.interface';

export interface MovieCollection {
  dates: {
    maximun: string;
    minimun: string;
  };
  page: number;
  results: SimplifiedMovie[];
  total_pages: number;
  total_results: number;
}
