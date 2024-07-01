import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { PurchasePageRoutingModule } from './purchase-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PurchasePageRoutingModule,
    ReactiveFormsModule,
    IonicModule.forRoot()
  ],
  declarations: [],

})
export class PurchasePageModule {}

