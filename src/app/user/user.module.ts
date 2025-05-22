import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ListModule } from '../list/list.module';
import { MovieModule } from '../movie/movie.module';
import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './pages/profile/profile.component';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    MovieModule,
    ListModule,
    SharedModule,
  ],
})
export class UserModule {}
