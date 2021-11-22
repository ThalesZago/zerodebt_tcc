import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from 'src/app/shared/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SpentsRoutingModule } from './spents-routing.module';
import { SpentsComponent } from './spents.component';

@NgModule({
  declarations: [SpentsComponent],
  imports: [CommonModule, SpentsRoutingModule, MaterialModule, SharedModule],
})
export class SpentsModule {}
