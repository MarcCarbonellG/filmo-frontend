import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { MovieShowcaseComponent } from './components/movie-showcase/movie-showcase.component';
import { MovieComponent } from './components/movie/movie.component';
import { MovieRoutingModule } from './movie-routing.module';
import { MovieDetailsComponent } from './pages/movie-details/movie-details.component';
import { SearchResultsComponent } from './pages/search-results/search-results.component';
import { MoneyShortPipe } from './pipes/money-short.pipe';

@NgModule({
  declarations: [
    MovieDetailsComponent,
    SearchResultsComponent,
    MovieShowcaseComponent,
    MovieComponent,
  ],
  imports: [
    CommonModule,
    MovieRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    MoneyShortPipe,
    FormsModule,
    SharedModule,
  ],
  exports: [MovieComponent, MovieShowcaseComponent],
})
export class MovieModule {}
