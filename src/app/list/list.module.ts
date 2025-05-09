import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ListRoutingModule } from './list-routing.module';
import { ListDetailsComponent } from './pages/list-details/list-details.component';

@NgModule({
  declarations: [ListDetailsComponent],
  imports: [CommonModule, ListRoutingModule, FormsModule],
})
export class ListModule {}
