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
import { switchMap, take } from 'rxjs/operators';
import { TableColumn } from 'src/app/interfaces/table-column';
import { IUser } from 'src/app/interfaces/user';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  aColumns: Array<TableColumn>;
  aColumnsHeaders: Array<string>;
  aUsers!: MatTableDataSource<IUser>;

  oForm: FormGroup;

  isLoading = true;

  refresh: BehaviorSubject<boolean>;

  resultsLength = 0;
  subscriptions$: Array<Subscription>;

  constructor(
    private usersService: UsersService,
    private formBuilder: FormBuilder,
  ) {
    this.aColumnsHeaders = [
      'name',
      'last_name',
      'document',
      'status',
      'actions',
    ];

    this.aColumns = [
      {
        label: 'TABLE.NAME',
        property: 'name',
        type: 'text',
      },
      {
        label: 'TABLE.LAST_NAME',
        property: 'last_name',
        type: 'text',
      },
      {
        label: 'TABLE.DOCUMENT',
        property: 'document',
        type: 'document',
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
          },
        ],
      },
      {
        label: 'TABLE.ACTIONS',
        property: 'actions',
        type: 'button',
      },
    ];

    this.oForm = this.formBuilder.group({ search: [''] });
    this.refresh = new BehaviorSubject<boolean>(false);
    this.subscriptions$ = new Array<Subscription>();
  }

  ngOnInit(): void {
    this.subscriptions$.push(
      merge(this.usersService.aUsers, this.usersService.aUsersSize).subscribe(
        res => {
          if (typeof res === 'number') {
            this.resultsLength = res;
          } else {
            this.aUsers = new MatTableDataSource(res);
          }
        },
      ),
    );
  }

  ngAfterViewInit(): void {
    this.subscriptions$.push(
      merge(this.sort?.sortChange).subscribe(
        () => (this.paginator.pageIndex = 0),
      ),
    );
    this.onPesquisar([]);
  }

  onPesquisar(aFiltros: Array<string>): void {
    this.subscriptions$.push(
      merge(this.sort?.sortChange, this.paginator?.page, this.refresh)
        .pipe(
          switchMap(() => {
            this.isLoading = true;

            return this.usersService.getUsers(
              this.paginator.pageSize,
              this.paginator.pageIndex + 1,
              aFiltros[0],
              this.sort.active,
              this.sort.direction,
              aFiltros[1],
              aFiltros[2],
              aFiltros[3],
            );
          }),
        )
        .subscribe(() => (this.isLoading = false)),
    );
  }

  handleStatus(id: number, status: boolean): void {
    this.usersService
      .changeUserStatus(id, status)
      .pipe(take(1))
      .subscribe(() => this.refresh.next(true));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.aUsers.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy(): void {
    this.subscriptions$.forEach(sub => sub.unsubscribe());
  }

  get search(): FormControl {
    return this.oForm.get('search') as FormControl;
  }
}
