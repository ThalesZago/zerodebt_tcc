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
import { TipCategory } from 'src/app/interfaces/tip-category';

@Component({
  selector: 'app-modal-tips-categories',
  templateUrl: './modal-tips-categories.component.html',
  styleUrls: ['./modal-tips-categories.component.scss'],
})
export class ModalTipsCategoriesComponent implements OnInit, AfterViewInit {
  form: FormGroup;

  @ViewChild('categoryInput') elementRef!: ElementRef<HTMLInputElement>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public tipCategory: TipCategory,
    private matDialogRef: MatDialogRef<ModalTipsCategoriesComponent>,
    private formBuilder: FormBuilder,
  ) {
    this.form = this.formBuilder.group({
      tip_id: [''],
      category: ['', [Validators.required]],
      status: [true],
    });
  }

  ngOnInit(): void {
    if (this.tipCategory) {
      this.form.setValue({
        tip_id: this.tipCategory.id,
        category: this.tipCategory.category,
        status: this.tipCategory.status,
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
