import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMaskModule } from 'ngx-mask';
import { DragAndDropDirective } from '../directives/drag-and-drop.directive';
import { MaterialModule } from './material.module';
import { SearchFilterComponent } from './search-filter/search-filter.component';

@NgModule({
  declarations: [DragAndDropDirective, SearchFilterComponent],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CKEditorModule,
    NgxMaskModule,
    DragAndDropDirective,
    SearchFilterComponent,
  ],
  imports: [CommonModule, MaterialModule, TranslateModule, ReactiveFormsModule],
})
export class SharedModule {}
