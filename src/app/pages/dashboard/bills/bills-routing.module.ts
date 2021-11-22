import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillResolver } from 'src/app/resolvers/bill.resolver';
import { BillsComponent } from './bills.component';

const routes: Routes = [
  {
    path: '',
    component: BillsComponent,
  },
  {
    path: 'edit/:id',
    loadChildren: () => import('./bill/bill.module').then(m => m.BillModule),
    resolve: { bill: BillResolver },
  },
  {
    path: 'create',
    loadChildren: () => import('./bill/bill.module').then(m => m.BillModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillsRoutingModule {}
