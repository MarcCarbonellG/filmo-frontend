import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MovieModule } from '../movie/movie.module';
import { ListShowcaseComponent } from './components/list-showcase/list-showcase.component';
import { ListRoutingModule } from './list-routing.module';
import { ListDetailsComponent } from './pages/list-details/list-details.component';

@NgModule({
  declarations: [ListDetailsComponent, ListShowcaseComponent],
  imports: [CommonModule, ListRoutingModule, FormsModule, MovieModule],
})
export class ListModule {}
