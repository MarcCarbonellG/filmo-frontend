import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { SearchbarComponent } from './components/searchbar/searchbar.component';

@NgModule({
  declarations: [HeaderComponent, SearchbarComponent, PaginationComponent],
  imports: [CommonModule, RouterModule, FormsModule],
  exports: [HeaderComponent, PaginationComponent],
})
export class SharedModule {}
