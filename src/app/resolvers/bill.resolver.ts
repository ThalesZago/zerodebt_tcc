import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Bill } from '../interfaces/bill';
import { BillService } from '../services/bill.service';

@Injectable({
  providedIn: 'root',
})
export class BillResolver implements Resolve<Bill> {
  constructor(private billService: BillService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Bill> {
    return this.billService.getBill(route.params['id']);
  }
}
