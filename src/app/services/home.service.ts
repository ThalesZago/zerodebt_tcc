import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Home } from '../interfaces/home';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class HomeService extends ErrorService {
  private _aHome: BehaviorSubject<Array<Home>>;
  private _aHomeSize: BehaviorSubject<number>;

  constructor(
    private httpClient: HttpClient,
    protected matSnackBar: MatSnackBar,
    protected translateService: TranslateService,
  ) {
    super(matSnackBar, translateService);

    this._aHome = new BehaviorSubject<Array<Home>>([]);
    this._aHomeSize = new BehaviorSubject<number>(0);
  }

  getHome(): Observable<Home> {
    return this.httpClient.get<Home>(`${environment.url}/api/home/get`);
  }
  setHome(Home: Array<Home>): void {
    this._aHome.next(Home);
  }

  setHomeSize(size: number): void {
    this._aHomeSize.next(size);
  }

  get aHome(): BehaviorSubject<Array<Home>> {
    return this._aHome;
  }

  get aHomeSize(): BehaviorSubject<number> {
    return this._aHomeSize;
  }
}
