import { List } from './list.interface';

export interface PagedLists {
  page: number;
  lists: List[];
  total_pages: number;
  total_results: number;
}
