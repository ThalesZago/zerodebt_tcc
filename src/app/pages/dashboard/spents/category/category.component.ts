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
import { ModalSpentCategoryComponent } from 'src/app/components/modal-spent-category/modal-spent-category.component';
import { SpentCategory } from 'src/app/interfaces/spent-category';
import { TableColumn } from 'src/app/interfaces/table-column';
import { SpentCategoryService } from 'src/app/services/spent-category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements AfterViewInit, OnInit, OnDestroy {
  aSpentCategory!: MatTableDataSource<SpentCategory>;
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
    private spentCategoryService: SpentCategoryService,
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
        this.spentCategoryService.aSpentCategory,
        this.spentCategoryService.aSpentCategorySize,
      ).subscribe(res => {
        if (typeof res === 'number') {
          this.resultsLength = res;
        } else {
          this.aSpentCategory = new MatTableDataSource(res);
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

  handleModal(spentCategory?: SpentCategory): void {
    this.matDialog
      .open(ModalSpentCategoryComponent, {
        minWidth: '400px',
        data: spentCategory,
      })
      .afterClosed()
      .subscribe((res: SpentCategory | undefined) => {
        if (res) {
          if (spentCategory) {
            this.spentCategoryService
              .editSpentCategory(res)
              .pipe(take(1))
              .subscribe(() => this.refresh.next(true));
          } else {
            this.spentCategoryService
              .createSpentCategory(res)
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

            return this.spentCategoryService.listSpentCategory(
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
