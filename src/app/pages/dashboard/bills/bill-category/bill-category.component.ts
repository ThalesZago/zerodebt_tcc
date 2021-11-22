import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
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
import { ModalBillCategoryComponent } from 'src/app/components/modal-bill-category/modal-bill-category.component';
import { BillCategory } from 'src/app/interfaces/bill-category';
import { TableColumn } from 'src/app/interfaces/table-column';
import { BillCategoryService } from 'src/app/services/bill-category.service';

@Component({
  selector: 'app-bill-category',
  templateUrl: './bill-category.component.html',
  styleUrls: ['./bill-category.component.scss'],
})
export class BillCategoryComponent implements AfterViewInit, OnInit, OnDestroy {
  aBillCategory!: MatTableDataSource<BillCategory>;
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
    private billCategoryService: BillCategoryService,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
  ) {
    this.aColumnsHeaders = ['title', 'actions'];

    this.aColumns = [
      {
        label: 'TABLE.TITLE',
        property: 'title',
        type: 'text',
      },
      {
        label: 'TABLE.ACTIONS',
        property: 'actions',
        type: 'button',
      },
    ];

    this.form = this.formBuilder.group({ search: [''] });
    this.refresh = new BehaviorSubject<boolean>(false);
    this.subscriptions$ = new Array<Subscription>();
  }

  ngOnInit(): void {
    this.subscriptions$.push(
      merge(
        this.billCategoryService.aBillCategory,
        this.billCategoryService.aBillCategorySize,
      ).subscribe(res => {
        if (typeof res === 'number') {
          this.resultsLength = res;
        } else {
          this.aBillCategory = new MatTableDataSource(res);
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

  handleModal(billCategory?: BillCategory): void {
    this.matDialog
      .open(ModalBillCategoryComponent, {
        minWidth: '400px',
        data: billCategory,
      })
      .afterClosed()
      .subscribe((res: BillCategory | undefined) => {
        if (res) {
          if (billCategory) {
            this.billCategoryService
              .editBillCategory(res)
              .pipe(take(1))
              .subscribe(() => this.refresh.next(true));
          } else {
            this.billCategoryService
              .createBillCategory(res)
              .pipe(take(1))
              .subscribe(() => this.refresh.next(true));
          }
        }
      });
  }

  onPesquisar(aFiltros: Array<string>): void {
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

            return this.billCategoryService.listBillCategory(
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
