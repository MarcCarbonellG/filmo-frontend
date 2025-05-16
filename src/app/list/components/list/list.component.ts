import { Component, Input } from '@angular/core';
import { MovieService } from '../../../movie/services/movie.service';
import { List } from '../../models/list.interface';

@Component({
  selector: 'app-list',
  standalone: false,
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
})
export class ListComponent {
  @Input() list!: List;
  @Input() scale: number = 1;
  baseImageUrl: string = '';

  constructor(private movieService: MovieService) {
    this.baseImageUrl = movieService.getImageBaseUrl();
  }
}
