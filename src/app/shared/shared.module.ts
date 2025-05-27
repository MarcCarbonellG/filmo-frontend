import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AvatarComponent } from './components/avatar/avatar.component';
import { HeaderComponent } from './components/header/header.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { SearchbarComponent } from './components/searchbar/searchbar.component';

@NgModule({
  declarations: [
    HeaderComponent,
    SearchbarComponent,
    PaginationComponent,
    AvatarComponent,
    NotFoundComponent,
  ],
  imports: [CommonModule, RouterModule, FormsModule],
  exports: [
    HeaderComponent,
    PaginationComponent,
    AvatarComponent,
    NotFoundComponent,
  ],
})
export class SharedModule {}
