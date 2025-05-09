import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListDetailsComponent } from './pages/list-details/list-details.component';

const routes: Routes = [{ path: ':id', component: ListDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListRoutingModule {}
