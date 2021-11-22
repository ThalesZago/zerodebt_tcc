import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from 'src/app/shared/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SpentRoutingModule } from './spent-routing.module';
import { SpentComponent } from './spent.component';

@NgModule({
  declarations: [SpentComponent],
  imports: [CommonModule, SpentRoutingModule, SharedModule, MaterialModule],
})
export class SpentModule {}
