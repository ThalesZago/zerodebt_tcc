import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./home/home.module').then(m => m.HomeModule),
      },
      {
        path: 'companies',
        loadChildren: () =>
          import('./companies/companies.module').then(m => m.CompaniesModule),
      },
      {
        path: 'bill',
        loadChildren: () =>
          import('./bills/bills.module').then(m => m.BillsModule),
      },
      {
        path: 'bill/category',
        loadChildren: () =>
          import('./bills/bill-category/bill-category.module').then(
            m => m.BillCategoryModule,
          ),
      },
      {
        path: 'spent',
        loadChildren: () =>
          import('./spents/spents.module').then(m => m.SpentsModule),
      },
      {
        path: 'spent/category',
        loadChildren: () =>
          import('./spents/category/category.module').then(
            m => m.CategoryModule,
          ),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./users/users.module').then(m => m.UsersModule),
      },
      {
        path: '',
        redirectTo: '/dashboard/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/dashboard/home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
