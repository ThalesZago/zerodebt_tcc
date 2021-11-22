import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, pluck, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Response } from '../interfaces/response';
import { Spent } from '../interfaces/spent';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class SpentService extends ErrorService {
  private _aSpent: BehaviorSubject<Array<Spent>>;
  private _aSpentSize: BehaviorSubject<number>;

  constructor(
    private httpClient: HttpClient,
    protected matSnackBar: MatSnackBar,
    protected translateService: TranslateService,
  ) {
    super(matSnackBar, translateService);

    this._aSpent = new BehaviorSubject<Array<Spent>>([]);
    this._aSpentSize = new BehaviorSubject<number>(0);
  }

  getSpent(spent_id: number): Observable<Spent> {
    return this.httpClient
      .get<Response>(`${environment.url}/api/spent/get?spent_id=${spent_id}`)
      .pipe(
        map(res => res.data as Spent),
        catchError(err => this.handleError(err)),
      );
  }

  listSpents(
    limit: number,
    page: number,
    title: string,
    order_field: string,
    order_direction: string,
  ): Observable<Array<Spent>> {
    if (order_field === 'id') {
      order_field = 'title';
    }
    return this.httpClient
      .post<Response>(`${environment.url}/api/spent/list`, {
        limit,
        page,
        title,
        order_field,
        order_direction,
      })
      .pipe(
        map(
          res =>
            res.data as {
              results: Array<Spent>;
              total_records: number;
            },
        ),
        tap(res => this.setSpentSize(res.total_records)),
        pluck('results'),
        tap(res => this.setSpent(res)),
        catchError(err => this.handleError(err)),
      );
  }

  createSpent(spent: Spent): Observable<Response> {
    return this.httpClient
      .post<Response>(`${environment.url}/api/spent/create`, spent)
      .pipe(
        tap(res => this.handleSuccess(res)),
        catchError(err => this.handleError(err)),
      );
  }

  editSpent(spent: Spent): Observable<Response> {
    return this.httpClient
      .put<Response>(`${environment.url}/api/spent/edit`, spent)
      .pipe(
        tap(res => this.handleSuccess(res)),
        catchError(err => this.handleError(err)),
      );
  }

  setSpent(spent: Array<Spent>): void {
    this._aSpent.next(spent);
  }

  setSpentSize(size: number): void {
    this._aSpentSize.next(size);
  }

  get aSpent(): BehaviorSubject<Array<Spent>> {
    return this._aSpent;
  }

  get aSpentSize(): BehaviorSubject<number> {
    return this._aSpentSize;
  }
}
