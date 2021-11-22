import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalSpentCategoryComponent } from 'src/app/components/modal-spent-category/modal-spent-category.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CategoryRoutingModule } from './category-routing.module';
import { CategoryComponent } from './category.component';

@NgModule({
  declarations: [CategoryComponent, ModalSpentCategoryComponent],
  imports: [CommonModule, CategoryRoutingModule, MaterialModule, SharedModule],
})
export class CategoryModule {}
