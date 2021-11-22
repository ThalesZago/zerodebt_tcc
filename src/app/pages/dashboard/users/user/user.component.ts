import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {
  oUser: IUser;
  oForm: FormGroup;
  isLoading: boolean;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private usersServicde: UsersService,
    private authService: AuthService,
  ) {
    this.oUser = this.route.snapshot.data.user as IUser;
    this.isLoading = false;
    if (this.oUser) {
      this.oForm = this.formBuilder.group({
        user_id: [''],
        ssid: [
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InRoYWxlc3phZ29Ab3V0bG9vay5jb20ifQ=.z7UKwEjeYMGXUJZWPlJ/WfGqUI3eMhQoN4D2KodhkAk=',
        ],
        name: ['', [Validators.required]],
        last_name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        cellphone: ['', [Validators.required]],
        document: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        country: ['', [Validators.required]],
        thumb: ['', [Validators.required]],
      });
    } else {
      this.oForm = this.formBuilder.group({
        user_id: [''],
        ssid: [
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InRoYWxlc3phZ29Ab3V0bG9vay5jb20ifQ=.z7UKwEjeYMGXUJZWPlJ/WfGqUI3eMhQoN4D2KodhkAk=',
        ],
        name: ['', [Validators.required]],
        last_name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        cellphone: ['', [Validators.required]],
        document: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        country: ['', [Validators.required]],
        thumb: ['', [Validators.required]],
        companies: ['', [Validators.required]],
        sectors: ['', [Validators.required]],
        profiles: ['', [Validators.required]],
        status: [true],
      });
    }
  }

  handleSubmit(): void {
    if (this.oForm.valid) {
      this.isLoading = true;
      if (this.oUser) {
        this.usersServicde.editUser(this.oForm.value).subscribe(() => {
          void this.router.navigateByUrl('dashboard/home');
          if (this.authService.user.user.id === this.id.value) {
            let userCopy = this.authService.user;
            userCopy = {
              ...userCopy,
              user: {
                name: this.name.value as string,
                thumb: this.thumb.value as string,
                id: this.id.value as number,
              } as IUser,
            };
            this.authService.handleUser(userCopy);
          }
          this.isLoading = false;
        });
      } else {
        this.usersServicde.createUser({ ...this.oForm.value }).subscribe(() => {
          void this.router.navigateByUrl('dashboard/home');
          this.isLoading = false;
        });
      }
    } else {
      this.oForm.markAllAsTouched();
    }
  }

  handleBack(): void {
    void this.router.navigateByUrl('dashboard/home');
  }

  get id(): FormControl {
    return this.oForm.get('user_id') as FormControl;
  }

  get name(): FormControl {
    return this.oForm.get('name') as FormControl;
  }

  get thumb(): FormControl {
    return this.oForm.get('thumb') as FormControl;
  }
}
