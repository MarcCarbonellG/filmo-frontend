import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MovieModule } from '../movie/movie.module';
import { ProfileComponent } from './pages/profile/profile.component';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  declarations: [ProfileComponent],
  imports: [CommonModule, UserRoutingModule, MovieModule],
})
export class UserModule {}
