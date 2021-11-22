import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Home } from '../interfaces/home';
import { HomeService } from '../services/home.service';

@Injectable({
  providedIn: 'root',
})
export class HomeResolver implements Resolve<Home> {
  constructor(private homeService: HomeService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Home> {
    return this.homeService.getHome();
  }
}
