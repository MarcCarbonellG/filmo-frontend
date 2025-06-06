import { Component, Input } from '@angular/core';
import { MovieService } from '../../../movie/services/movie.service';
import { List } from '../../models/list.interface';

@Component({
  selector: 'app-list-showcase',
  standalone: false,
  templateUrl: './list-showcase.component.html',
  styleUrl: './list-showcase.component.css',
})
export class ListShowcaseComponent {
  @Input() title: string = '';
  @Input() lists: List[] = [];
  @Input() scale: number = 1;
  baseImageUrl: string = '';

  constructor(private movieService: MovieService) {
    this.baseImageUrl = movieService.getImageBaseUrl();
  }
}
