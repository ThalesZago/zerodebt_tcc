import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable()
export class SSIDInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    // NGX Translate Request
    if (request.url.includes('lang')) {
      return next.handle(request);
    } else {
      const encryptedUser = localStorage.getItem('WN_USER');

      if (typeof encryptedUser === 'string') {
        const { SSID, EMPSSID, SSTK } = JSON.parse(atob(encryptedUser)) as User;

        request = request.clone({
          setHeaders: {
            'Content-Type': 'application/json',
            SSTK,
            EMPSSID,
            SSID,
          },
        });
      }
    }

    return next.handle(request);
  }
}
