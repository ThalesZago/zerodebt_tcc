import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map, pluck } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Module } from '../interfaces/module';
import { Response } from '../interfaces/response';
import { User } from '../interfaces/user';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionService extends ErrorService {
  constructor(
    private httpClient: HttpClient,
    protected matSnackBar: MatSnackBar,
    protected translateService: TranslateService,
  ) {
    super(matSnackBar, translateService);
  }

  getModules(): Observable<Array<Module>> {
    const encryptedUser = localStorage.getItem('WN_USER');

    if (typeof encryptedUser === 'string') {
      const { SSID } = JSON.parse(atob(encryptedUser)) as User;

      return this.httpClient
        .post<Response>(`${environment.url}/api/permission/modules`, {
          ssid: SSID,
        })
        .pipe(
          map(
            res =>
              JSON.parse(atob(res.data as string)) as {
                modules: Array<Module>;
              },
          ),
          pluck('modules'),
          catchError(err => this.handleError(err)),
        );
    }

    return EMPTY;
  }
}
