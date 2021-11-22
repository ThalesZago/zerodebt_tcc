import { Injectable } from'@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Company } from '../interfaces/company';
import { CompaniesService } from '../services/companies.service';

@Injectable({
    providedIn: 'root',
})
export class CompanyResolver implements Resolve<Company> {
    constructor(private companiesService: CompaniesService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Company> {
        return this.companiesService.getCompany(route.params['id']);
    }
}