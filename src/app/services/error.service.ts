import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Observable, throwError } from 'rxjs';
import { Response } from '../interfaces/response';

export class ErrorService {
  constructor(
    protected matSnackBar: MatSnackBar,
    protected translateService: TranslateService,
  ) {}

  handleSuccess(res: Response): void {
    this.handleToast(res.message || 'SUCCESS', 'success');
  }

  handleError(err: HttpErrorResponse): Observable<never> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    this.handleToast(err.error?.message || 'ERRORS.SERVER', 'error');

    return throwError(err);
  }

  handleToast(message: string, type: string): void {
    this.matSnackBar.open(this.translateService.instant(message), undefined, {
      panelClass: type === 'error' ? 'snackbar_error' : 'snackbar_success',
      duration: 3000,
    });
  }
}
