import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Movie } from '../../models/movie.interface';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movie-details',
  standalone: false,
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css',
})
export class MovieDetailsComponent implements OnInit {
  movie: Movie | null = null;
  movieId: string | null = null;
  errorMessage: string | null = null;
  baseImageUrl: string;

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute
  ) {
    this.baseImageUrl = this.movieService.getImageBaseUrl();
  }

  ngOnInit(): void {
    this.movieId = this.route.snapshot.paramMap.get('id');
    this.loadMovie();
  }

  loadMovie() {
    if (!this.movieId) {
      this.errorMessage = 'Error al cargar películas en cartelera';
    } else {
      this.movieService.getMovieById(this.movieId).subscribe({
        next: (data) => {
          this.movie = data;
        },
        error: (err) => {
          this.errorMessage = 'Error al cargar películas en cartelera';
        },
      });
    }
  }
}
