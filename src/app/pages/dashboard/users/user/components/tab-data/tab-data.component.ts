/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { ModalImageComponent } from 'src/app/components/modal-image/modal-image.component';
import { Company } from 'src/app/interfaces/company';
import { ICompanyUserSectors } from 'src/app/interfaces/company-user-sectors';
import { iProfile } from 'src/app/interfaces/profile';
import { IUser } from 'src/app/interfaces/user';
import { CompaniesService } from 'src/app/services/companies.service';
import { LocationService } from 'src/app/services/location.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-tab-data',
  templateUrl: './tab-data.component.html',
  styleUrls: ['./tab-data.component.scss'],
})
export class TabDataComponent implements OnInit, AfterViewInit {
  aCountries: { id: number; name: string }[];
  aFilteredCountries: { id: number; name: string }[];
  aStates: { id: number; name: string }[];
  mStates: Map<string, number>;
  aFilteredStates: { id: number; name: string }[];
  aCities: { id: number; name: string }[];
  aFilteredCities: { id: number; name: string }[];
  aCompanies: Array<Company>;
  aProfiles: Array<iProfile>;
  aSectors: Array<ICompanyUserSectors>;

  @Input() oUser: IUser | undefined;
  @Input() oForm!: FormGroup;
  @ViewChild('costumerInput') elementRef!: ElementRef<HTMLInputElement>;

  constructor(
    private locationService: LocationService,
    private matDialog: MatDialog,
    private companyService: CompaniesService,
    private profileService: ProfileService,
  ) {
    this.aCountries = [];
    this.aFilteredCountries = [];
    this.aStates = [];
    this.mStates = new Map([]);
    this.aFilteredStates = [];
    this.aCities = [];
    this.aFilteredCities = [];
    this.aCompanies = new Array<Company>();
    this.aProfiles = new Array<iProfile>();
    this.aSectors = new Array<ICompanyUserSectors>();
  }

  ngOnInit(): void {
    if (this.oUser) {
      this.oForm?.patchValue({
        user_id: this.oUser.id,
        name: this.oUser.name,
        last_name: this.oUser.last_name,
        email: this.oUser.email,
        cellphone: this.oUser.cellphone,
        document: this.oUser.document,
        city: this.oUser.city,
        state: this.oUser.state,
        country: this.oUser.country,
        thumb: this.oUser.thumb,
      });
    }
    this.fetchData();
    this.fetchCountries();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.elementRef.nativeElement.focus();
    }, 500);
  }

  handleModal(image: string): void {
    this.matDialog.open(ModalImageComponent, {
      minWidth: '400px',
      maxWidth: '80vw',
      maxHeight: '80vh',
      data: image,
    });
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
          `data:${files[0].type};base64,${
            (reader.result as string).split(',')[1]
          }`,
        );
      };
    } else {
      this.thumb.markAllAsTouched();
      this.thumb.setErrors({ required: true });
    }
  }

  clearImage() {
    this.thumb.reset();
  }

  fetchCountries(): void {
    this.locationService
      .getCountries()
      .pipe(take(1))
      .subscribe(res => {
        this.aCountries = res;
        this.aFilteredCountries = [...this.aCountries];

        if (this.oUser) {
          if (this.oUser.country === 'Brasil') {
            this.locationService
              .getStates()
              .pipe(
                take(1),
                switchMap(res => {
                  this.mStates = new Map(res.map(el => [el.name, el.id]));
                  this.aStates = res;
                  this.aFilteredStates = [...this.aStates];

                  return this.locationService.getCities(
                    Number(this.mStates.get((this.oUser as IUser).state)),
                  );
                }),
                take(1),
              )
              .subscribe(res => {
                this.aCities = res;
                this.aFilteredCities = [...this.aCities];

                this.oForm?.patchValue({
                  country: (this.oUser as IUser).country,
                  city: (this.oUser as IUser).city,
                  state: (this.oUser as IUser).state,
                });
              });
          }
        }
      });
  }

  fetchStates(country: string): void {
    if (country === 'Brasil') {
      this.city.setValue('');

      this.locationService
        .getStates()
        .pipe(take(1))
        .subscribe(res => {
          this.mStates = new Map(res.map(el => [el.name, el.id]));
          this.aStates = res;
          this.aFilteredStates = [...this.aStates];
        });
    } else {
      this.aStates = [];
      this.aFilteredStates = [];
      this.aCities = [];
      this.aFilteredCities = [];
      this.city.setValue('');
      this.state.setValue('');
    }
  }

  fetchCities(state: string): void {
    this.locationService
      .getCities(Number(this.mStates.get(state)))
      .pipe(take(1))
      .subscribe(res => {
        this.aCities = res;
        this.aFilteredCities = [...this.aCities];
      });
  }

  private fetchData() {
    forkJoin([
      this.companyService.getCompanies(
        99,
        0,
        '',
        'company_name',
        'asc',
        '',
        '',
        '',
        '',
      ),
      this.profileService.getProfiles(),
      this.companyService.getCompanyUserSectors(),
    ])
      .pipe()
      .subscribe(([aCompanies, aProfiles, aSectors]) => {
        this.aCompanies = aCompanies;
        this.aProfiles = aProfiles;
        this.aSectors = aSectors;
      });
  }

  get name(): FormControl {
    return this.oForm?.get('name') as FormControl;
  }

  get last_name(): FormControl {
    return this.oForm?.get('last_name') as FormControl;
  }

  get email(): FormControl {
    return this.oForm?.get('email') as FormControl;
  }

  get cellphone(): FormControl {
    return this.oForm?.get('cellphone') as FormControl;
  }

  get document(): FormControl {
    return this.oForm?.get('document') as FormControl;
  }

  get city(): FormControl {
    return this.oForm?.get('city') as FormControl;
  }

  get state(): FormControl {
    return this.oForm?.get('state') as FormControl;
  }

  get country(): FormControl {
    return this.oForm?.get('country') as FormControl;
  }

  get thumb(): FormControl {
    return this.oForm?.get('thumb') as FormControl;
  }

  get companies(): FormControl {
    return this.oForm?.get('companies') as FormControl;
  }

  get sectors(): FormControl {
    return this.oForm?.get('sectors') as FormControl;
  }

  get profiles(): FormControl {
    return this.oForm?.get('profiles') as FormControl;
  }
}
