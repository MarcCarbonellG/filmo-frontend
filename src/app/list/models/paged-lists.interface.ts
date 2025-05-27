import { List } from './list.interface';

export interface PagedLists {
  page: number;
  lists: List[];
  totalPages: number;
  totalResults: number;
}
