import { NgModule } from '@angular/core';
import { CompanyComponent } from './company.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{path: '', component: CompanyComponent}]

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class CompanyRoutingModule { }
