import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from 'src/app/shared/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { BillsRoutingModule } from './bills-routing.module';
import { BillsComponent } from './bills.component';

@NgModule({
  declarations: [BillsComponent],
  imports: [CommonModule, BillsRoutingModule, MaterialModule, SharedModule],
})
export class BillsModule {}
