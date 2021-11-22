import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, merge, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  take,
} from 'rxjs/operators';
import { Bill } from 'src/app/interfaces/bill';
import { TableColumn } from 'src/app/interfaces/table-column';
import { BillCategoryService } from 'src/app/services/bill-category.service';
import { BillService } from 'src/app/services/bill.service';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.scss'],
})
export class BillsComponent implements AfterViewInit, OnInit, OnDestroy {
  aBill!: MatTableDataSource<Bill>;
  aBillCategoryMap: Map<number, string>;
  aColumns: Array<TableColumn>;
  aColumnsHeaders: Array<string>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  resultsLength = 0;
  loading = true;

  form: FormGroup;
  refresh: BehaviorSubject<boolean>;
  subscriptions$: Array<Subscription>;

  constructor(
    private billService: BillService,
    private billCategoryService: BillCategoryService,
    private formBuilder: FormBuilder,
  ) {
    this.aColumnsHeaders = [
      'title',
      'start_date',
      'end_date',
      'value',
      'status',
      'actions',
    ];

    this.aColumns = [
      {
        label: 'TABLE.TITLE',
        property: 'title',
        type: 'text',
      },
      {
        label: 'TABLE.DATE_START',
        property: 'start_date',
        type: 'date',
      },
      {
        label: 'TABLE.DATE_END',
        property: 'end_date',
        type: 'date',
      },
      {
        label: 'TABLE.VALUE',
        property: 'value',
        type: 'number',
      },
      {
        label: 'TABLE.STATUS',
        property: 'status',
        type: 'chip',
      },
      {
        label: 'TABLE.ACTIONS',
        property: 'actions',
        type: 'button',
      },
    ];

    this.aBillCategoryMap = new Map<number, string>();
    this.form = this.formBuilder.group({ search: [''] });
    this.refresh = new BehaviorSubject<boolean>(false);
    this.subscriptions$ = new Array<Subscription>();
  }

  ngOnInit(): void {
    this.subscriptions$.push(
      this.billCategoryService
        .listBillCategory(999, 1, '', 'bill_category_id', 'asc')
        .pipe(
          switchMap(res => {
            this.aColumns[1].selections = res;
            this.aBillCategoryMap = new Map<number, string>(
              res.map(el => [el.bill_category_id, el.title]),
            );

            return merge(this.billService.aBill, this.billService.aBillSize);
          }),
        )
        .subscribe(res => {
          if (typeof res === 'number') {
            this.resultsLength = res;
          } else {
            this.aBill = new MatTableDataSource([...res]);
          }
        }),
    );
  }

  ngAfterViewInit(): void {
    this.subscriptions$.push(
      merge(
        this.sort?.sortChange,
        this.search.valueChanges.pipe(
          debounceTime(500),
          distinctUntilChanged(),
        ),
      ).subscribe(() => (this.paginator.pageIndex = 0)),
    );
    this.onPesquisar([]);
  }

  handleStatus(bill_id: number, status: string): void {
    this.billService
      .changeBillStatus(bill_id, status)
      .pipe(take(1))
      .subscribe(() => this.refresh.next(true));
  }

  onPesquisar(aFiltros: Array<any>): void {
    this.subscriptions$.push(
      merge(
        this.sort?.sortChange,
        this.paginator?.page,
        this.search.valueChanges.pipe(
          debounceTime(500),
          distinctUntilChanged(),
        ),
        this.refresh,
      )
        .pipe(
          switchMap(() => {
            this.loading = true;
            return this.billService.listBills(
              this.paginator.pageSize,
              this.paginator.pageIndex + 1,
              aFiltros[0] ? aFiltros[0] : this.search?.value,
              this.sort.active,
              this.sort.direction,
            );
          }),
        )
        .subscribe(() => (this.loading = false)),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions$.forEach(sub => sub.unsubscribe());
  }

  get search(): FormControl {
    return this.form.get('search') as FormControl;
  }
}
