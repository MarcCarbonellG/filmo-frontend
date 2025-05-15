import { Component, Input } from '@angular/core';
import { DbMovie } from '../../models/db-movie';
import { SimplifiedMovie } from '../../models/simplified-movie.interface';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movie',
  standalone: false,
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.css',
})
export class MovieComponent {
  @Input() movie!: SimplifiedMovie | DbMovie;
  baseImageUrl: string = '';

  constructor(private movieService: MovieService) {
    this.baseImageUrl = movieService.getImageBaseUrl();
  }
}
