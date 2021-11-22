import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillCategoryComponent } from './bill-category.component';

const routes: Routes = [{ path: '', component: BillCategoryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillCategoryRoutingModule {}
