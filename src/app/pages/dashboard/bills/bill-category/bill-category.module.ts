import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalBillCategoryComponent } from 'src/app/components/modal-bill-category/modal-bill-category.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { BillCategoryRoutingModule } from './bill-category-routing.module';
import { BillCategoryComponent } from './bill-category.component';

@NgModule({
  declarations: [BillCategoryComponent, ModalBillCategoryComponent],
  imports: [
    CommonModule,
    BillCategoryRoutingModule,
    MaterialModule,
    SharedModule,
  ],
})
export class BillCategoryModule {}
