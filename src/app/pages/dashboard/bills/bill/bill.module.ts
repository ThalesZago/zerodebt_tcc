import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from 'src/app/shared/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { BillRoutingModule } from './bill-routing.module';
import { BillComponent } from './bill.component';

@NgModule({
  declarations: [BillComponent],
  imports: [CommonModule, BillRoutingModule, SharedModule, MaterialModule],
})
export class BillModule {}
