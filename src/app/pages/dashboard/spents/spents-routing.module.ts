import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpentResolver } from 'src/app/resolvers/spent.resolver';
import { SpentsComponent } from './spents.component';

const routes: Routes = [
  {
    path: '',
    component: SpentsComponent,
  },
  {
    path: 'edit/:id',
    loadChildren: () => import('./spent/spent.module').then(m => m.SpentModule),
    resolve: { spent: SpentResolver },
  },
  {
    path: 'create',
    loadChildren: () => import('./spent/spent.module').then(m => m.SpentModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpentsRoutingModule {}
