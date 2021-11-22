import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from 'src/app/shared/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CompanyRoutingModule } from './company-routing.module';
import { CompanyComponent } from './company.component';
import { TabDataComponent } from './components/tab-data/tab-data.component';
import { TabInvitesComponent } from './components/tab-invites/tab-invites.component';



@NgModule({
  declarations: [CompanyComponent, TabDataComponent, TabInvitesComponent],
  imports: [
    CommonModule, CompanyRoutingModule, SharedModule, MaterialModule
  ],
})
export class CompanyModule { }
