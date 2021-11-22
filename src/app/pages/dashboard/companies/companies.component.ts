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
import { Company } from 'src/app/interfaces/company';
import { CompanyTypes } from 'src/app/interfaces/company-types';
import { TableColumn } from 'src/app/interfaces/table-column';
import { CompaniesService } from 'src/app/services/companies.service';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent implements AfterViewInit, OnInit, OnDestroy {
  aCompanies!: MatTableDataSource<Company>;
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
    private companiesService: CompaniesService,
    private formBuilder: FormBuilder,
  ) {
    this.aColumnsHeaders = [
      'document',
      'company_name',
      'fantasy_name',
      'email',
      'code',
      'status',
      'actions',
    ];

    this.aColumns = [
      {
        label: 'TABLE.DOCUMENT',
        property: 'document',
        type: 'document',
      },
      {
        label: 'TABLE.COMPANY_NAME',
        property: 'company_name',
        type: 'text',
      },
      {
        label: 'TABLE.FANTASY_NAME',
        property: 'fantasy_name',
        type: 'text',
      },
      {
        label: 'TABLE.COMPANY_EMAIL',
        property: 'email',
        type: 'text',
      },
      {
        label: 'TABLE.COMPANY_CODE',
        property: 'code',
        type: 'text',
      },
      {
        label: 'TABLE.STATUS',
        property: 'status',
        type: 'chip',
        selections: [
          {
            id: true, 
            category: 'TABLE.ACTIVE',
          },
          {
            id: false,
            category: 'TABLE.INACTIVE',
          }
        ]
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
        this.companiesService.aCompanies,
        this.companiesService.aCompaniesSize,
      ).subscribe(res => {
        if  (typeof res === 'number') {
          this.resultsLength = res;
        } else {
          this.aCompanies = new MatTableDataSource(res);
        }
      }),
    );
  }
  ngAfterViewInit(): void {
    this.subscriptions$.push(
      merge(
        this.sort?.sortChange,
      ).subscribe(() => (this.paginator.pageIndex = 0)),
    );
    this.onPesquisar([]);
  }

  handleStatus(id: number, status: boolean): void {
    this.loading = true;
    this.companiesService
      .changeCompanyStatus(id, status)
      .pipe(take(1))
      .subscribe(() => this.refresh.next(true));
  }

  ngOnDestroy(): void {
    this.subscriptions$.forEach(sub => sub.unsubscribe());
  }

  onPesquisar(aFiltros: Array<string>): void {
    this.subscriptions$.push(
      merge(
        this.sort?.sortChange,
        this.paginator?.page,
        this.refresh,
      )
        .pipe(
          switchMap(() => {
            this.loading = true;

            return this.companiesService.getCompanies(
              this.paginator.pageSize,
              this.paginator.pageIndex + 1,
              aFiltros[0],
              this.sort.active,
              this.sort.direction,
              aFiltros[1],
              aFiltros[2],
              aFiltros[3],
              aFiltros[4],         

            );
          }),
        )
        .subscribe(() => (this.loading = false)),
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.aCompanies.filter = filterValue.trim().toLowerCase();
  }
  get search(): FormControl {
    return this.form.get('search') as FormControl;
  }
}
