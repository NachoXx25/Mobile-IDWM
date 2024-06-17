import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PurchaseListComponent } from './purchase.page';

const routes: Routes = [
  {
    path: '',
    component: PurchaseListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchasePageRoutingModule {}
