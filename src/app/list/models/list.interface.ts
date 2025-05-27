import { DbMovie } from '../../movie/models/db-movie';

export interface List {
  id: number;
  author: string;
  author_avatar: string;
  title: string;
  description: string;
  user_id: number;
  movies: DbMovie[];
  saved: number;
  page: number;
  totalResults: number;
  totalPages: number;
}
