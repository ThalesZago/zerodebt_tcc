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
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Spent } from 'src/app/interfaces/spent';
import { TableColumn } from 'src/app/interfaces/table-column';
import { SpentCategoryService } from 'src/app/services/spent-category.service';
import { SpentService } from 'src/app/services/spent.service';

@Component({
  selector: 'app-spents',
  templateUrl: './spents.component.html',
  styleUrls: ['./spents.component.scss'],
})
export class SpentsComponent implements AfterViewInit, OnInit, OnDestroy {
  aSpent!: MatTableDataSource<Spent>;
  aSpentCategoryMap: Map<number, string>;
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
    private SpentService: SpentService,
    private SpentCategoryService: SpentCategoryService,
    private formBuilder: FormBuilder,
  ) {
    this.aColumnsHeaders = ['title', 'start_date', 'value', 'actions'];

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
        label: 'TABLE.VALUE',
        property: 'value',
        type: 'number',
      },
      {
        label: 'TABLE.ACTIONS',
        property: 'actions',
        type: 'button',
      },
    ];

    this.aSpentCategoryMap = new Map<number, string>();
    this.form = this.formBuilder.group({ search: [''] });
    this.refresh = new BehaviorSubject<boolean>(false);
    this.subscriptions$ = new Array<Subscription>();
  }

  ngOnInit(): void {
    this.subscriptions$.push(
      this.SpentCategoryService.listSpentCategory(
        999,
        1,
        '',
        'spent_category_id',
        'asc',
      )
        .pipe(
          switchMap(res => {
            this.aColumns[1].selections = res;
            this.aSpentCategoryMap = new Map<number, string>(
              res.map(el => [el.spent_category_id, el.title]),
            );

            return merge(
              this.SpentService.aSpent,
              this.SpentService.aSpentSize,
            );
          }),
        )
        .subscribe(res => {
          if (typeof res === 'number') {
            this.resultsLength = res;
          } else {
            this.aSpent = new MatTableDataSource([...res]);
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
            return this.SpentService.listSpents(
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
