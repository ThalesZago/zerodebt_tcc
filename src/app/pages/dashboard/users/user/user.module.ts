import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from 'src/app/shared/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { TabDataComponent } from './components/tab-data/tab-data.component';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';

@NgModule({
  declarations: [UserComponent, TabDataComponent],
  imports: [CommonModule, UserRoutingModule, SharedModule, MaterialModule],
})
export class UserModule {}
