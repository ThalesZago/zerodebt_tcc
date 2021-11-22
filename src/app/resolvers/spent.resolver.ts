import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Spent } from '../interfaces/spent';
import { SpentService } from '../services/spent.service';

@Injectable({
  providedIn: 'root',
})
export class SpentResolver implements Resolve<Spent> {
  constructor(private SpentService: SpentService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Spent> {
    return this.SpentService.getSpent(route.params['id']);
  }
}
