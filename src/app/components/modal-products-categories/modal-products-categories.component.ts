import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductCategory } from 'src/app/interfaces/product-category';

@Component({
  selector: 'app-modal-products-categories',
  templateUrl: './modal-products-categories.component.html',
  styleUrls: ['./modal-products-categories.component.scss'],
})
export class ModalProductsCategoriesComponent implements OnInit, AfterViewInit {
  form: FormGroup;

  @ViewChild('categoryInput') elementRef!: ElementRef<HTMLInputElement>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public productCategory: ProductCategory,
    private matDialogRef: MatDialogRef<ModalProductsCategoriesComponent>,
    private formBuilder: FormBuilder,
  ) {
    this.form = this.formBuilder.group({
      product_category_id: [''],
      category: ['', [Validators.required]],
      status: [true],
    });
  }

  ngOnInit(): void {
    if (this.productCategory) {
      this.form.setValue({
        product_category_id: this.productCategory.id,
        category: this.productCategory.category,
        status: this.productCategory.status,
      });
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.elementRef.nativeElement.focus();
    }, 500);
  }

  handleSubmit(): void {
    if (this.form.valid) {
      this.matDialogRef.close(this.form.value);
    }
  }

  handleClose(): void {
    this.matDialogRef.close();
  }

  get category(): FormControl {
    return this.form.get('category') as FormControl;
  }

  get status(): FormControl {
    return this.form.get('status') as FormControl;
  }
}
