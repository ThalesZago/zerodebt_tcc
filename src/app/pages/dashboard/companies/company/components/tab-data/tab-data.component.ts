import { ThisReceiver } from '@angular/compiler';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { finalize, switchMap, take } from 'rxjs/operators';
import { Company } from 'src/app/interfaces/company';
import { CompanyTypes } from 'src/app/interfaces/company-types';
import { CompaniesService } from 'src/app/services/companies.service';
import { ModalImageComponent } from 'src/app/components/modal-image/modal-image.component';
import { ICompanyUserSectors } from 'src/app/interfaces/company-user-sectors';
import { forkJoin } from 'rxjs';
import { ProfileService } from 'src/app/services/profile.service';
import { iProfile } from 'src/app/interfaces/profile';
@Component({
  selector: 'app-tab-data',
  templateUrl: './tab-data.component.html',
  styleUrls: ['./tab-data.component.scss'],
})
export class TabDataComponent implements OnInit, AfterViewInit {
  @Input() oCompany: Company | undefined;
  @Input() form!: FormGroup;
  @ViewChild('companyInput') elementRef!: ElementRef<HTMLInputElement>;
  aType: Array<CompanyTypes>;
  aUser: Array<ICompanyUserSectors>;
  aProfile: Array<iProfile>;
  loading: boolean = true;

  constructor(
    private companiesService: CompaniesService,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private profileService: ProfileService
  ) {
    this.aType = new Array<CompanyTypes>();
    this.aUser = new Array<ICompanyUserSectors>();
    this.aProfile = new Array<iProfile>();
  }

  ngOnInit(): void {
    this.fetchData();
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.elementRef.nativeElement.focus();
    }, 500);
  }

  fetchData() {
    forkJoin([
      this.companiesService.getCompanyUserSectors(),
      this.companiesService.getCompanyTypes(),
      this.profileService.getProfiles(),
    ])
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(([aUser, aType, aProfile]) => {
        this.aUser = aUser;
        this.aType = aType;
        this.aProfile = aProfile;
      });
  }

  handleModal(image: string): void {
    this.matDialog.open(ModalImageComponent, {
      minWidth: '400px',
      maxWidth: '80vw',
      maxHeight: '80vh',
      data: image,
    });
  }

  clearImage(){
    this.thumb.reset();
  }
  handleFileUpload(upload: FileList | Event): void {
    let files: FileList;

    if (upload instanceof Event) {
      files = (upload.target as HTMLInputElement).files as FileList;
    } else {
      files = upload;
    }

    const reader = new FileReader();

    // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
    if (files[0].type.match(/image\/*/) !== null) {
      reader.readAsDataURL(files[0]);

      reader.onload = () => {
        this.thumb.setValue(
          `data:image/jpeg;base64,${(reader.result as string).split(',')[1]}`,
        );
      };
    } else {
      this.thumb.markAllAsTouched();
      this.thumb.setErrors({ required: true });
    }
  }

  get company_name(): FormControl {
    return this.form?.get('company_name') as FormControl;
  }

  get fantasy_name(): FormControl {
    return this.form?.get('fantasy_name') as FormControl;
  }

  get email(): FormControl {
    return this.form?.get('email') as FormControl;
  }

  get document(): FormControl {
    return this.form?.get('document') as FormControl;
  }

  get code(): FormControl {
    return this.form?.get('code') as FormControl;
  }

  get type_company_id(): FormControl {
    return this.form?.get('type_company_id') as FormControl;
  }

  get thumb(): FormControl {
    return this.form?.get('thumb') as FormControl;
  }

  get user_sectors(): FormControl {
    return this.form?.get('user_sectors') as FormControl;
  }

  get company_profiles(): FormControl {
    return this.form?.get('company_profiles') as FormControl;
  }
}
