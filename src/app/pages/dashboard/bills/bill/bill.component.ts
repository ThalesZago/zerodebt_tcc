/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Bill } from 'src/app/interfaces/bill';
import { BillCategory } from 'src/app/interfaces/bill-category';
import { BillCategoryService } from 'src/app/services/bill-category.service';
import { BillService } from 'src/app/services/bill.service';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss'],
})
export class BillComponent implements OnInit, AfterViewInit {
  oBill: Bill;
  aBillCategory!: Array<BillCategory>;
  form: FormGroup;

  @ViewChild('titleInput') elementRef!: ElementRef<HTMLInputElement>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private billCategoryService: BillCategoryService,
    private billService: BillService,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
  ) {
    this.oBill = this.route.snapshot.data.bill as Bill;

    this.form = this.formBuilder.group({
      bill_id: [''],
      title: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      value: [''],
      status: ['waiting.payment'],
      bill_category_id: [''],
    });
  }

  ngOnInit(): void {
    this.billCategoryService
      .listBillCategory(999, 1, '', 'id', 'asc')
      .pipe(take(1))
      .subscribe(res => {
        this.aBillCategory = res;
      });

    if (this.oBill) {
      this.form.patchValue({
        bill_id: this.oBill.bill_id,
        title: this.oBill.title,
        start_date: this.oBill.start_date,
        end_date: this.oBill.end_date,
        value: this.oBill.value,
        status: this.oBill.status,
        bill_category_id: this.oBill.bill_category_id,
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
      if (this.oBill) {
        const bill = {
          bill_id: this.bill_id.value as number,
          title: this.title.value as string,
          start_date: this.start_date.value as string,
          end_date: this.end_date.value as string,
          value: this.value.value as number,
          status: this.status.value as string,
          bill_category_id: this.bill_category_id.value as number,
        };

        this.billService
          .editBill(bill as Bill)
          .pipe(take(1))
          .subscribe(() => void this.router.navigateByUrl('dashboard/bill'));
      } else {
        const bill = {
          title: this.title.value as string,
          start_date: this.start_date.value as string,
          end_date: this.end_date.value as string,
          value: this.value.value as number,
          status: this.status.value as string,
          bill_category_id: this.bill_category_id.value as number,
        };

        this.billService
          .createBill(bill as Bill)
          .pipe(take(1))
          .subscribe(() => void this.router.navigateByUrl('dashboard/bill'));
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  handleBack(): void {
    void this.router.navigateByUrl('dashboard/bill');
  }

  get bill_id(): FormControl {
    return this.form.get('bill_id') as FormControl;
  }

  get title(): FormControl {
    return this.form.get('title') as FormControl;
  }

  get start_date(): FormControl {
    return this.form.get('start_date') as FormControl;
  }

  get end_date(): FormArray {
    return this.form.get('end_date') as FormArray;
  }

  get status(): FormControl {
    return this.form.get('status') as FormControl;
  }

  get value(): FormControl {
    return this.form.get('value') as FormControl;
  }

  get bill_category_id(): FormControl {
    return this.form.get('bill_category_id') as FormControl;
  }
}
