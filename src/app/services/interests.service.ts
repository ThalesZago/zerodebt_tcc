import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, pluck, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Iinterest } from '../interfaces/interest';
import { Response } from '../interfaces/response';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class InterestsService extends ErrorService {
  private _aInterests: BehaviorSubject<Array<Iinterest>>;
  private _aInterestsSize: BehaviorSubject<number>;

  constructor(
    private httpClient: HttpClient,
    protected matSnackBar: MatSnackBar,
    protected translateService: TranslateService,
  ) {
    super(matSnackBar, translateService);
    this._aInterests = new BehaviorSubject<Array<Iinterest>>([]);
    this._aInterestsSize = new BehaviorSubject<number>(0);
  }

  getInterests(
    limit: number,
    page: number,
    order_field: string,
    order_direction: string,
    type_sending: string,
    send_customer_opportunity: boolean,
    created_at: string,
    name: string,
    last_name: string,
    company_name: string,
    fantasy_name: string,
  ): Observable<Array<Iinterest>> {
    return this.httpClient
      .post<Response>(`${environment.url}/api/interest-list/list`, {
        limit,
        page,
        order_field,
        order_direction,
        type_sending,
        send_customer_opportunity,
        created_at,
        name,
        last_name,
        company_name,
        fantasy_name,
      })
      .pipe(
        map(
          res =>
            res.data as {
              results: Array<Iinterest>;
              total_records: number;
            },
        ),
        tap(res => this.setInterestsSize(res.total_records)),
        pluck('results'),
        tap(res => this.setInterests(res)),
        catchError(err => this.handleError(err)),
      );
  }

  changeInterestsStatus(
    customer_opportunity_interest_list_id: number,
    send_customer_opportunity: boolean,
  ): Observable<Response> {
    return this.httpClient
      .put<Response>(`${environment.url}/api/interest-list/change-status`, {
        customer_opportunity_interest_list_id,
        send_customer_opportunity,
      })
      .pipe(
        tap(res => this.handleSuccess(res)),
        catchError(err => this.handleError(err)),
      );
  }

  setInterests(interest: Array<Iinterest>): void {
    this._aInterests.next(interest);
  }

  setInterestsSize(size: number): void {
    this._aInterestsSize.next(size);
  }

  get aInterests(): BehaviorSubject<Array<Iinterest>> {
    return this._aInterests;
  }

  get aInterestsSize(): BehaviorSubject<number> {
    return this._aInterestsSize;
  }
}
