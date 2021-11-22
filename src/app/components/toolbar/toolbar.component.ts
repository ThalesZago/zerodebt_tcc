import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';
import { Company } from 'src/app/interfaces/company';
import { IUser } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { SideNavService } from 'src/app/services/sidenav.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit, OnDestroy {
  subscriptions$: Subscription[];
  activeRoute: string;
  oForm: FormGroup;
  aCompanies: Array<Company>;
  user: IUser;

  constructor(
    private sideNavService: SideNavService,
    private translateService: TranslateService,
    private router: Router,
    private formBuilder: FormBuilder,
    private companiesService: CompaniesService,
    private authService: AuthService,
  ) {
    this.activeRoute = '';
    this.subscriptions$ = new Array<Subscription>();
    this.subscriptions$.push(
      this.router.events
        .pipe(
          filter((event: any) => event instanceof NavigationEnd),
          switchMap((event: NavigationEnd) => {
            return this.translateService.get(
              `MENU.${event.url.split('/')[2].toUpperCase()}`,
            );
          }),
        )
        .subscribe((res: string) => {
          this.activeRoute = res;
        }),
    );
    this.oForm = this.formBuilder.group({
      selectEmpresa: [''],
    });
    this.aCompanies = new Array<Company>();
    this.user = {} as IUser;
  }

  ngOnInit(): void {
    this.getEmpresas();
    this.translateService
      .get(`MENU.${this.router.url.split('/')[2].toUpperCase()}`)
      .pipe(take(1))
      .subscribe((res: string) => {
        this.activeRoute = res;
      });
    this.user = this.authService.user.user;
  }

  toggleSideNavSize(): void {
    this.sideNavService.toggleSize();
  }

  ngOnDestroy(): void {
    this.subscriptions$.forEach(sub => sub.unsubscribe());
  }

  private getEmpresas() {
    this.companiesService
      .getCompanies(99, 0, '', 'company_name', 'asc', '', '', '', '')
      .subscribe((aRet: Array<Company>) => {
        this.aCompanies = aRet;
      });
    this.selectEmpresa.setValue(1);
  }

  get selectEmpresa(): FormControl {
    return this.oForm.get('selectEmpresa') as FormControl;
  }
}
