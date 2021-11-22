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
import { BillCategory } from 'src/app/interfaces/bill-category';

@Component({
  selector: 'app-modal-bill-category',
  templateUrl: './modal-bill-category.component.html',
  styleUrls: ['./modal-bill-category.component.scss'],
})
export class ModalBillCategoryComponent implements OnInit, AfterViewInit {
  form: FormGroup;

  @ViewChild('titleInput') elementRef!: ElementRef<HTMLInputElement>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public billCategory: BillCategory,
    private matDialogRef: MatDialogRef<ModalBillCategoryComponent>,
    private formBuilder: FormBuilder,
  ) {
    this.form = this.formBuilder.group({
      bill_category_id: [''],
      title: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.billCategory) {
      this.form.setValue({
        bill_category_id: this.billCategory.bill_category_id,
        title: this.billCategory.title,
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

  get title(): FormControl {
    return this.form.get('title') as FormControl;
  }
}
