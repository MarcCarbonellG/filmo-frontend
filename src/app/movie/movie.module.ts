import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MovieRoutingModule } from './movie-routing.module';
import { MovieDetailsComponent } from './pages/movie-details/movie-details.component';
import { SearchResultsComponent } from './pages/search-results/search-results.component';

@NgModule({
  declarations: [MovieDetailsComponent, SearchResultsComponent],
  imports: [
    CommonModule,
    MovieRoutingModule,
    RouterModule,
    ReactiveFormsModule,
  ],
})
export class MovieModule {}
