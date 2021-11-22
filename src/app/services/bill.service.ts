import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, pluck, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Bill } from '../interfaces/bill';
import { Response } from '../interfaces/response';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class BillService extends ErrorService {
  private _aBill: BehaviorSubject<Array<Bill>>;
  private _aBillSize: BehaviorSubject<number>;

  constructor(
    private httpClient: HttpClient,
    protected matSnackBar: MatSnackBar,
    protected translateService: TranslateService,
  ) {
    super(matSnackBar, translateService);

    this._aBill = new BehaviorSubject<Array<Bill>>([]);
    this._aBillSize = new BehaviorSubject<number>(0);
  }

  getBill(bill_id: number): Observable<Bill> {
    return this.httpClient
      .get<Response>(`${environment.url}/api/bill/get?bill_id=${bill_id}`)
      .pipe(
        map(res => res.data as Bill),
        catchError(err => this.handleError(err)),
      );
  }

  listBills(
    limit: number,
    page: number,
    title: string,
    order_field: string,
    order_direction: string,
  ): Observable<Array<Bill>> {
    if (order_field === 'id') {
      order_field = 'title';
    }
    return this.httpClient
      .post<Response>(`${environment.url}/api/bill/list`, {
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
              results: Array<Bill>;
              total_records: number;
            },
        ),
        tap(res => this.setBillSize(res.total_records)),
        pluck('results'),
        tap(res => this.setBill(res)),
        catchError(err => this.handleError(err)),
      );
  }

  createBill(bill: Bill): Observable<Response> {
    return this.httpClient
      .post<Response>(`${environment.url}/api/bill/create`, bill)
      .pipe(
        tap(res => this.handleSuccess(res)),
        catchError(err => this.handleError(err)),
      );
  }

  editBill(bill: Bill): Observable<Response> {
    return this.httpClient
      .put<Response>(`${environment.url}/api/bill/edit`, bill)
      .pipe(
        tap(res => this.handleSuccess(res)),
        catchError(err => this.handleError(err)),
      );
  }

  changeBillStatus(bill_id: number, status: string): Observable<Response> {
    return this.httpClient
      .put<Response>(`${environment.url}/api/bill/change-status`, {
        bill_id,
        status,
      })
      .pipe(
        tap(res => this.handleSuccess(res)),
        catchError(err => this.handleError(err)),
      );
  }

  setBill(bill: Array<Bill>): void {
    this._aBill.next(bill);
  }

  setBillSize(size: number): void {
    this._aBillSize.next(size);
  }

  get aBill(): BehaviorSubject<Array<Bill>> {
    return this._aBill;
  }

  get aBillSize(): BehaviorSubject<number> {
    return this._aBillSize;
  }
}
