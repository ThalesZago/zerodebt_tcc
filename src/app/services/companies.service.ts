import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, pluck, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Company } from '../interfaces/company';
import { CompanyTypes } from '../interfaces/company-types';
import { ICompanyUserSectors } from '../interfaces/company-user-sectors';
import { Response } from '../interfaces/response';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class CompaniesService extends ErrorService {
  private _aCompanies: BehaviorSubject<Array<Company>>;
  private _aCompaniesSize: BehaviorSubject<number>;

  constructor(
    private httpClient: HttpClient,
    protected matSnackBar: MatSnackBar,
    protected translateService: TranslateService,
  ) {
    super(matSnackBar, translateService);
    this._aCompanies = new BehaviorSubject<Array<Company>>([]);
    this._aCompaniesSize = new BehaviorSubject<number>(0);
  }

  getCompany(id: number): Observable<Company> {
    return this.httpClient
      .get<Response>(`${environment.url}/api/company/get?company_id=${id}`)
      .pipe(
        map(res => res.data as Company),
        catchError(err => this.handleError(err)),
      );
  }

  getCompanyTypes() {
    return this.httpClient
      .get<Response>(`${environment.url}/api/company/types`)
      .pipe(
        map(res => res.data as Array<CompanyTypes>),
        catchError(err => this.handleError(err)),
      );
  }

  getCompanyUserSectors(): Observable<ICompanyUserSectors[]> {
    return this.httpClient
      .post<Response>(`${environment.url}/api/sector/list`, {
        limit: 9999,
        page: 1,
        order_field: 'id',
        order_direction: 'asc',
      })
      .pipe(
        map(res => res.data as { results: Array<ICompanyUserSectors> }),
        pluck('results'),
        catchError(err => this.handleError(err)),
      );
  }

  getCompanies(
    limit: number,
    page: number,
    document: string,
    order_field: string,
    order_direction: string,
    company_name: string,
    fantasy_name: string,
    email: string,
    code: string,
  ): Observable<Array<Company>> {
    return this.httpClient
      .post<Response>(`${environment.url}/api/company/list`, {
        limit,
        page,
        document,
        order_field,
        order_direction,
        company_name,
        fantasy_name,
        email,
        code,
      })
      .pipe(
        map(
          res =>
            res.data as {
              results: Array<Company>;
              total_records: number;
            },
        ),
        tap(res => this.setCompaniesSize(res.total_records)),
        pluck('results'),
        tap(res => this.setCompanies(res)),
        catchError(err => this.handleError(err)),
      );
  }

  createCompany(company: Company): Observable<Response> {
    return this.httpClient
      .post<Response>(`${environment.url}/api/company/create`, company)
      .pipe(
        tap(res => this.handleSuccess(res)),
        catchError(err => this.handleError(err)),
      );
  }

  changeCompanyStatus(
    company_id: number,
    status: boolean,
  ): Observable<Response> {
    return this.httpClient
      .post<Response>(`${environment.url}/api/company/change-status`, {
        company_id,
        status,
      })
      .pipe(
        tap(res => this.handleSuccess(res)),
        catchError(err => this.handleError(err)),
      );
  }

  editCompany(company: Company): Observable<Response> {
    return this.httpClient
      .post<Response>(`${environment.url}/api/company/edit`, company)
      .pipe(
        tap(res => this.handleSuccess(res)),
        catchError(err => this.handleError(err)),
      );
  }

  setCompanies(company: Array<Company>): void {
    this._aCompanies.next(company);
  }

  setCompaniesSize(size: number): void {
    this._aCompaniesSize.next(size);
  }

  get aCompanies(): BehaviorSubject<Array<Company>> {
    return this._aCompanies;
  }

  get aCompaniesSize(): BehaviorSubject<number> {
    return this._aCompaniesSize;
  }
}
