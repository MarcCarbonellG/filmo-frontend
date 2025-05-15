import { Component, Input } from '@angular/core';
import { SimplifiedMovie } from '../../models/simplified-movie.interface';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movie-showcase',
  standalone: false,
  templateUrl: './movie-showcase.component.html',
  styleUrl: './movie-showcase.component.css',
})
export class MovieShowcaseComponent {
  @Input() title: string = '';
  @Input() movies: SimplifiedMovie[] = [];
  baseImageUrl: string = '';

  constructor(private movieService: MovieService) {
    this.baseImageUrl = movieService.getImageBaseUrl();
  }
}
