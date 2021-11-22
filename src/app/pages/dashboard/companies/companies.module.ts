import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from 'src/app/shared/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CompaniesRoutingModule } from './companies-routing.module';
import { CompaniesComponent } from './companies.component';

@NgModule({
  declarations: [CompaniesComponent],
  imports: [CommonModule, CompaniesRoutingModule, MaterialModule, SharedModule],
})
export class CompaniesModule { }
