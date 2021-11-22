import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, pluck, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Response } from '../interfaces/response';
import { SpentCategory } from '../interfaces/spent-category';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class SpentCategoryService extends ErrorService {
  private _aSpentCategory: BehaviorSubject<Array<SpentCategory>>;
  private _aSpentCategorySize: BehaviorSubject<number>;

  constructor(
    private httpClient: HttpClient,
    protected matSnackBar: MatSnackBar,
    protected translateService: TranslateService,
  ) {
    super(matSnackBar, translateService);

    this._aSpentCategory = new BehaviorSubject<Array<SpentCategory>>([]);
    this._aSpentCategorySize = new BehaviorSubject<number>(0);
  }

  listSpentCategory(
    limit: number,
    page: number,
    title: string,
    order_field: string,
    order_direction: string,
  ): Observable<Array<SpentCategory>> {
    if (order_field === 'id') {
      order_field = 'title';
    }
    return this.httpClient
      .post<Response>(`${environment.url}/api/spent/category/list`, {
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
              results: Array<SpentCategory>;
              total_records: number;
            },
        ),
        tap(res => this.setSpentCategorySize(res.total_records)),
        pluck('results'),
        tap(res => this.setSpentCategory(res)),
        catchError(err => this.handleError(err)),
      );
  }

  createSpentCategory(title: SpentCategory): Observable<Response> {
    return this.httpClient
      .post<Response>(`${environment.url}/api/spent/category/create`, title)
      .pipe(
        tap(res => this.handleSuccess(res)),
        catchError(err => this.handleError(err)),
      );
  }

  editSpentCategory(title: SpentCategory): Observable<Response> {
    return this.httpClient
      .put<Response>(`${environment.url}/api/spent/category/edit`, title)
      .pipe(
        tap(res => this.handleSuccess(res)),
        catchError(err => this.handleError(err)),
      );
  }

  setSpentCategory(SpentCategory: Array<SpentCategory>): void {
    this._aSpentCategory.next(SpentCategory);
  }

  setSpentCategorySize(size: number): void {
    this._aSpentCategorySize.next(size);
  }

  get aSpentCategory(): BehaviorSubject<Array<SpentCategory>> {
    return this._aSpentCategory;
  }

  get aSpentCategorySize(): BehaviorSubject<number> {
    return this._aSpentCategorySize;
  }
}
