import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyResolver } from 'src/app/resolvers/company.resolver'
import { CompaniesComponent } from './companies.component';

const routes: Routes = [
  { path: '', component: CompaniesComponent },
  {
    path: 'edit/:id',
    loadChildren: () =>
      import('./company/company.module').then(m => m.CompanyModule),
    resolve: { company: CompanyResolver },
  },
  {
    path: 'create',
    loadChildren: () =>
      import('./company/company.module').then(m => m.CompanyModule),
  },
];

@NgModule({
  
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompaniesRoutingModule { }
