import { Injectable } from'@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Company } from '../interfaces/company';
import { ICompanyUserSectors } from '../interfaces/company-user-sectors';
import { CompaniesService } from '../services/companies.service';

@Injectable({
    providedIn: 'root',
})
export class CompanyUserSectorsResolver implements Resolve<ICompanyUserSectors[]> {
    constructor(private companiesService: CompaniesService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<ICompanyUserSectors[]> {
        return this.companiesService.getCompanyUserSectors(route.params['id']);
    }
}