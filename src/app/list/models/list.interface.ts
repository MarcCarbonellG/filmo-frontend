import { DbMovie } from '../../movie/models/db-movie';

export interface List {
  id: number;
  author: string;
  title: string;
  description: string;
  user_id: number;
  movies: DbMovie[];
  saved: number;
  page: number;
  total_results: number;
  total_pages: number;
}
