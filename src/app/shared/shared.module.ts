import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SearchbarComponent } from './components/searchbar/searchbar.component';

@NgModule({
  declarations: [HeaderComponent, SearchbarComponent],
  imports: [CommonModule, RouterModule, FormsModule],
  exports: [HeaderComponent],
})
export class SharedModule {}
