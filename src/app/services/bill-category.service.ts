import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, pluck, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BillCategory } from '../interfaces/bill-category';
import { Response } from '../interfaces/response';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class BillCategoryService extends ErrorService {
  private _aBillCategory: BehaviorSubject<Array<BillCategory>>;
  private _aBillCategorySize: BehaviorSubject<number>;

  constructor(
    private httpClient: HttpClient,
    protected matSnackBar: MatSnackBar,
    protected translateService: TranslateService,
  ) {
    super(matSnackBar, translateService);

    this._aBillCategory = new BehaviorSubject<Array<BillCategory>>([]);
    this._aBillCategorySize = new BehaviorSubject<number>(0);
  }

  listBillCategory(
    limit: number,
    page: number,
    title: string,
    order_field: string,
    order_direction: string,
  ): Observable<Array<BillCategory>> {
    if (order_field === 'id') {
      order_field = 'title';
    }
    return this.httpClient
      .post<Response>(`${environment.url}/api/bill/category/list`, {
        limit,
        page,
        title,
        order_field,
        order_direction,
      })
      .pipe(
        map(
          res =>
            res.data as { results: Array<BillCategory>; total_records: number },
        ),
        tap(res => this.setBillCategorySize(res.total_records)),
        pluck('results'),
        tap(res => this.setBillCategory(res)),
        catchError(err => this.handleError(err)),
      );
  }

  createBillCategory(title: BillCategory): Observable<Response> {
    return this.httpClient
      .post<Response>(`${environment.url}/api/bill/category/create`, title)
      .pipe(
        tap(res => this.handleSuccess(res)),
        catchError(err => this.handleError(err)),
      );
  }

  editBillCategory(title: BillCategory): Observable<Response> {
    return this.httpClient
      .put<Response>(`${environment.url}/api/bill/category/edit`, title)
      .pipe(
        tap(res => this.handleSuccess(res)),
        catchError(err => this.handleError(err)),
      );
  }

  setBillCategory(billCategory: Array<BillCategory>): void {
    this._aBillCategory.next(billCategory);
  }

  setBillCategorySize(size: number): void {
    this._aBillCategorySize.next(size);
  }

  get aBillCategory(): BehaviorSubject<Array<BillCategory>> {
    return this._aBillCategory;
  }

  get aBillCategorySize(): BehaviorSubject<number> {
    return this._aBillCategorySize;
  }
}
