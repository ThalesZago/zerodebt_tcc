/* eslint-disable prefer-const */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, pluck, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Response } from '../interfaces/response';
import { IUser } from '../interfaces/user';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService extends ErrorService {
  private _aUsers: BehaviorSubject<Array<IUser>>;
  private _aUsersSize: BehaviorSubject<number>;

  constructor(
    private httpClient: HttpClient,
    protected matSnackBar: MatSnackBar,
    protected translateService: TranslateService,
  ) {
    super(matSnackBar, translateService);
    this._aUsers = new BehaviorSubject<Array<IUser>>([]);
    this._aUsersSize = new BehaviorSubject<number>(0);
  }

  getUser(user_id: number): Observable<IUser> {
    return this.httpClient
      .get<Response>(`${environment.url}/api/users/get?user_id=${user_id}`)
      .pipe(
        map(res => res.data as IUser),
        catchError(err => this.handleError(err)),
      );
  }

  getUsers(
    limit: number,
    page: number,
    name: string,
    order_field: string,
    order_direction: string,
    last_name: string,
    document: string,
    status: string,
  ): Observable<Array<IUser>> {
    return this.httpClient
      .post<Response>(`${environment.url}/api/users/list`, {
        limit,
        page,
        name,
        order_field,
        order_direction,
        last_name,
        document,
        status,
      })
      .pipe(
        map(
          res =>
            res.data as {
              results: Array<IUser>;
              total_records: number;
            },
        ),
        tap(res => this.setUsersSize(res.total_records)),
        pluck('results'),
        tap(res => this.setUsers(res)),
        catchError(err => this.handleError(err)),
      );
  }

  changeUserStatus(user_id: number, status: boolean): Observable<Response> {
    return this.httpClient
      .post<Response>(`${environment.url}/api/users/change-status`, {
        user_id,
        status,
      })
      .pipe(
        tap(res => this.handleSuccess(res)),
        catchError(err => this.handleError(err)),
      );
  }

  createUser(user: IUser): Observable<Response> {
    class company {
      company_id!: number;
      default!: boolean;
    }
    class profile {
      profile_id!: number;
    }
    class sector {
      sector_id!: number;
    }

    const oUser = user;
    let companies: Array<company>;
    let profiles: Array<profile>;
    let sectors: Array<sector>;

    companies = new Array<company>();
    profiles = new Array<profile>();
    sectors = new Array<sector>();

    user.companies.forEach(company_id => {
      const oCompany = {
        company_id: Number(company_id),
        default: true,
      };
      companies.push(oCompany);
    });
    user.profiles.forEach(profile_id => {
      const oProfile = {
        profile_id: Number(profile_id),
      };
      profiles.push(oProfile);
    });
    user.sectors.forEach(sector_id => {
      const oSector = {
        sector_id: Number(sector_id),
      };
      sectors.push(oSector);
    });

    oUser.companies = companies;
    oUser.profiles = profiles;
    oUser.sectors = sectors;

    return this.httpClient
      .post<Response>(`${environment.url}/api/users/create`, oUser)
      .pipe(
        tap(res => this.handleSuccess(res)),
        catchError(err => this.handleError(err)),
      );
  }

  editUser(user: IUser): Observable<Response> {
    return this.httpClient
      .post<Response>(`${environment.url}/api/users/edit`, user)
      .pipe(
        tap(res => this.handleSuccess(res)),
        catchError(err => this.handleError(err)),
      );
  }

  setUsers(costumer: Array<IUser>): void {
    this._aUsers.next(costumer);
  }

  setUsersSize(size: number): void {
    this._aUsersSize.next(size);
  }

  get aUsers(): BehaviorSubject<Array<IUser>> {
    return this._aUsers;
  }

  get aUsersSize(): BehaviorSubject<number> {
    return this._aUsersSize;
  }
}
