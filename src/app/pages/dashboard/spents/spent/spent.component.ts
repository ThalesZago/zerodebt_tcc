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
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Spent } from 'src/app/interfaces/spent';
import { SpentCategory } from 'src/app/interfaces/spent-category';
import { SpentCategoryService } from 'src/app/services/spent-category.service';
import { SpentService } from 'src/app/services/spent.service';

@Component({
  selector: 'app-spent',
  templateUrl: './spent.component.html',
  styleUrls: ['./spent.component.scss'],
})
export class SpentComponent implements OnInit, AfterViewInit {
  oSpent: Spent;
  aSpentCategory!: Array<SpentCategory>;
  form: FormGroup;

  @ViewChild('titleInput') elementRef!: ElementRef<HTMLInputElement>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private spentCategoryService: SpentCategoryService,
    private spentService: SpentService,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
  ) {
    this.oSpent = this.route.snapshot.data.spent as Spent;

    this.form = this.formBuilder.group({
      spent_id: [''],
      title: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      value: [''],
      spent_category_id: [''],
    });
  }

  ngOnInit(): void {
    this.spentCategoryService
      .listSpentCategory(999, 1, '', 'id', 'asc')
      .pipe(take(1))
      .subscribe(res => {
        this.aSpentCategory = res;
      });

    if (this.oSpent) {
      this.form.patchValue({
        spent_id: this.oSpent.spent_id,
        title: this.oSpent.title,
        start_date: this.oSpent.start_date,
        value: this.oSpent.value,
        spent_category_id: this.oSpent.spent_category_id,
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
      if (this.oSpent) {
        const spent = {
          spent_id: this.spent_id.value as string,
          title: this.title.value as string,
          start_date: this.start_date.value as string,
          value: this.value.value as number,
          spent_category_id: this.spent_category_id.value as number,
        };

        this.spentService
          .editSpent(spent as Spent)
          .pipe(take(1))
          .subscribe(() => void this.router.navigateByUrl('dashboard/spent'));
      } else {
        const spent = {
          title: this.title.value as string,
          start_date: this.start_date.value as string,
          value: this.value.value as number,
          spent_category_id: this.spent_category_id.value as number,
        };

        this.spentService
          .createSpent(spent as Spent)
          .pipe(take(1))
          .subscribe(() => void this.router.navigateByUrl('dashboard/spent'));
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  handleBack(): void {
    void this.router.navigateByUrl('dashboard/spent');
  }

  get spent_id(): FormControl {
    return this.form.get('spent_id') as FormControl;
  }

  get title(): FormControl {
    return this.form.get('title') as FormControl;
  }

  get start_date(): FormControl {
    return this.form.get('start_date') as FormControl;
  }

  get value(): FormControl {
    return this.form.get('value') as FormControl;
  }

  get spent_category_id(): FormControl {
    return this.form.get('spent_category_id') as FormControl;
  }
}
