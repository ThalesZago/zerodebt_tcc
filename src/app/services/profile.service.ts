import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, pluck } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Company } from '../interfaces/company';
import { iProfile } from '../interfaces/profile';
import { Response } from '../interfaces/response';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService extends ErrorService {
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

  getProfiles(): Observable<iProfile[]> {
    return this.httpClient
      .post<Response>(`${environment.url}/api/profile/list`, {
        limit: 9999,
        page: 1,
        order_field: 'id',
        order_direction: 'asc',
      })
      .pipe(
        map(res => res.data as { results: Array<iProfile> }),
        pluck('results'),
        catchError(err => this.handleError(err)),
      );
  }
}
