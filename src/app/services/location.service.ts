import {
  HttpBackend,
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Address } from '../interfaces/location';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class LocationService extends ErrorService {
  constructor(
    private httpClient: HttpClient,
    private httpBackend: HttpBackend,
    protected matSnackBar: MatSnackBar,
    protected translateService: TranslateService,
  ) {
    super(matSnackBar, translateService);

    this.httpClient = new HttpClient(this.httpBackend);
  }

  getCountries(): Observable<Array<{ id: number; name: string }>> {
    return this.httpClient
      .get<{ numericCode: number; nativeName: string }[]>(
        'https://restcountries.eu/rest/v2/all?fields=nativeName;numericCode',
      )
      .pipe(
        map(res =>
          res.map(el => ({ id: el.numericCode, name: el.nativeName })),
        ),
      );
  }

  getStates(): Observable<{ id: number; name: string }[]> {
    return this.httpClient
      .get<{ id: number; nome: string }[]>(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome',
      )
      .pipe(map(res => res.map(el => ({ id: el.id, name: el.nome }))));
  }

  getCities(stateId: number): Observable<{ id: number; name: string }[]> {
    return this.httpClient
      .get<{ id: number; nome: string }[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateId}/municipios?orderBy=nome`,
      )
      .pipe(map(res => res.map(el => ({ id: el.id, name: el.nome }))));
  }

  getAddress(postalCode: number): Observable<Address> {
    return this.httpClient
      .get<Address>(`https://viacep.com.br/ws/${postalCode}/json`)
      .pipe(
        tap(res => {
          if (res.erro) {
            this.handleError(
              new HttpErrorResponse({
                error: { message: 'CEP Inválido' },
                status: 403,
              }),
            );
          }
        }),
      );
  }
}
