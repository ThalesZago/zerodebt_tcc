import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, take } from 'rxjs/operators';
import { Company } from 'src/app/interfaces/company';
import { CompaniesService } from 'src/app/services/companies.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent {
  oCompany: Company;
  form: FormGroup;
  isLoading: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private companiesService: CompaniesService,
  ) { 
    this.oCompany = this.route.snapshot.data.company as Company;
    this.isLoading = false;
    if (this.oCompany){
      this.form = this.formBuilder.group({
        company_id: [this.oCompany.id],
        company_name: [this.oCompany.company_name, [Validators.required]],
        fantasy_name: [this.oCompany.fantasy_name, [Validators.required]],
        email: [this.oCompany.email, [Validators.required]],
        document: [this.oCompany.document, [Validators.required]],
        code: [this.oCompany.code, [Validators.required]],
        thumb:[this.oCompany.thumb,[Validators.required]],
        status: [true],
      });
    } else {
      this.form = this.formBuilder.group({
        company_id: [''],
        company_name: ['', [Validators.required]],
        fantasy_name: ['', [Validators.required]],
        email: ['', [Validators.required]],
        document: ['', [Validators.required]],
        code: ['', [Validators.required]],
        type_company_id: ['', [Validators.required]],
        thumb:['', [Validators.required]],
        user_sectors: ['', [Validators.required]],
        company_profiles: ['', Validators.required],
        status: [true],
      });
    }
  }

  handleSubmit(): void {
    if (this.form.valid) {
      this.isLoading = true;
      if (this.oCompany) {
        this.companiesService
          .editCompany(this.form.value)
          .pipe(take(1),finalize(() => this.isLoading = false))
          .subscribe(() => {
            void this.router.navigateByUrl('dashboard/companies');
          });
      } else {
        const company = {...this.form.value, company_profiles:this.form.value.company_profiles.map((el:number) =>  ({profile_id: el})) ,user_sectors: this.form.value.user_sectors.map((el:number) => ({sector_id: el}))}
        this.companiesService
          .createCompany(company)
          .pipe(take(1), finalize(() => this.isLoading = false))
          .subscribe(() => {
            void this.router.navigateByUrl('dashboard/companies');
            
          });
      }
    } else {
      this.form.markAllAsTouched();
    }
  }
  handleBack(): void {
    void this.router.navigateByUrl('dashboard/companies');
  }

}
