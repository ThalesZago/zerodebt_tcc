import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { catchError, map, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Response } from '../interfaces/response';
import { IUser, User } from '../interfaces/user';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends ErrorService {
  public oUser!: User;
  private userData: BehaviorSubject<User>;

  constructor(
    private httpClient: HttpClient,
    private httpBackend: HttpBackend,
    protected matSnackBar: MatSnackBar,
    protected translateService: TranslateService,
  ) {
    super(matSnackBar, translateService);

    this.httpClient = new HttpClient(this.httpBackend);

    this.userData = new BehaviorSubject<User>({
      EMPSSID: '',
      SSID: '',
      SSTK: '',
      email: '',
      remember_me: false,
      user: {} as IUser,
    });
  }

  login(
    email: string,
    password: string,
    remember_me: boolean,
  ): Observable<User> {
    return this.httpClient
      .post<Response>(`${environment.url}/api/access/login`, {
        email,
        password,
      })
      .pipe(
        map(res => res.data as User),
        tap(res => this.handleUser({ ...res, email, remember_me })),
        catchError(err => this.handleError(err)),
      );
  }

  logout(): Observable<Response> {
    const encryptedUser = localStorage.getItem('WN_USER');

    if (typeof encryptedUser === 'string') {
      const { SSID } = JSON.parse(atob(encryptedUser)) as User;

      return this.httpClient
        .post<Response>(`${environment.url}/api/access/logout`, {
          ssid: SSID,
        })
        .pipe(
          tap(() => this.handleDeleteUser()),
          catchError(err => this.handleError(err)),
        );
    }

    return EMPTY;
  }

  forceLogout(email: string, password: string): Observable<Response> {
    return this.httpClient
      .post<Response>(`${environment.url}/api/access/user-logout`, {
        email,
        password,
      })
      .pipe(
        tap(res => this.handleSuccess(res)),
        catchError(err => this.handleError(err)),
      );
  }

  autoLogin(): void {
    const encryptedUser = localStorage.getItem('WN_USER');

    if (encryptedUser) {
      const { remember_me } = JSON.parse(atob(encryptedUser)) as User;

      if (remember_me) {
        this.handleUser(JSON.parse(atob(encryptedUser)));
      } else {
        this.logout().pipe(take(1)).subscribe();
      }
    }
  }

  revokePassword(email: string): Observable<string> {
    return this.httpClient
      .post<Response>(`${environment.url}/api/revoke-password`, { email })
      .pipe(
        tap(res => this.handleSuccess(res)),
        map(res => res.data as string),
        catchError(err => this.handleError(err)),
      );
  }

  verifyPin(email: string, code_recovery: string): Observable<string> {
    return this.httpClient
      .post<Response>(`${environment.url}/api/verify-recovery-pin`, {
        email,
        code_recovery,
      })
      .pipe(
        map(res => res.data as string),
        catchError(err => this.handleError(err)),
      );
  }

  recoveryPassword(
    email: string,
    code_recovery: string,
    password: string,
    confirm_password: string,
  ): Observable<string> {
    return this.httpClient
      .post<Response>(`${environment.url}/api/recovery-password`, {
        email,
        code_recovery,
        password,
        confirm_password,
      })
      .pipe(
        tap(res => this.handleSuccess(res)),
        map(res => res.data as string),
        catchError(err => this.handleError(err)),
      );
  }

  handleUser(user: User): void {
    localStorage.setItem('WN_USER', btoa(JSON.stringify(user)));
    this.oUser = user;
    return this.userData.next(user);
  }

  handleDeleteUser(): void {
    localStorage.removeItem('WN_USER');
  }

  get user(): User {
    return this.userData.value;
  }

  get userObservable(): Observable<User> {
    return this.userData.asObservable();
  }
}
