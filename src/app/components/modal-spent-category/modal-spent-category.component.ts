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
import { SpentCategory } from 'src/app/interfaces/spent-category';

@Component({
  selector: 'app-modal-spent-category',
  templateUrl: './modal-spent-category.component.html',
  styleUrls: ['./modal-spent-category.component.scss'],
})
export class ModalSpentCategoryComponent implements OnInit, AfterViewInit {
  form: FormGroup;

  @ViewChild('titleInput') elementRef!: ElementRef<HTMLInputElement>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public spentCategory: SpentCategory,
    private matDialogRef: MatDialogRef<ModalSpentCategoryComponent>,
    private formBuilder: FormBuilder,
  ) {
    this.form = this.formBuilder.group({
      spent_category_id: [''],
      title: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.spentCategory) {
      this.form.setValue({
        spent_category_id: this.spentCategory.spent_category_id,
        title: this.spentCategory.title,
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
