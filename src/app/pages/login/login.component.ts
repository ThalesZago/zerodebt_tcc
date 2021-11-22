import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { finalize, take } from 'rxjs/operators';
import { ModalLogoutComponent } from 'src/app/components/modal-logout/modal-logout.component';
import { ModalRecoveryComponent } from 'src/app/components/modal-recovery/modal-recovery.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form: FormGroup;
  loading = false;

  hidePassword: boolean;
  hidePasswordConfirm: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private matDialog: MatDialog,
  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      remember_me: [true],
    });
    this.hidePassword = true;
    this.hidePasswordConfirm = true;
  }

  handleFormSubmit(): void {
    if (this.form.valid) {
      this.loading = true;

      this.authService
        .login(this.email?.value, this.password?.value, this.remember_me?.value)
        .pipe(
          take(1),
          finalize(() => (this.loading = false)),
        )
        .subscribe(
          () => void this.router.navigateByUrl('/dashboard/home'),
          (err: { error: { status: number } }) => {
            if (err.error.status === 90000) {
              this.matDialog.open(ModalLogoutComponent, {
                minWidth: '250px',
                data: {
                  email: this.email?.value as string,
                  password: this.password?.value as string,
                },
              });
            }
          },
        );
    }
  }

  handleRecovery(): void {
    this.matDialog.open(ModalRecoveryComponent);
  }

  get email(): FormControl {
    return this.form.get('email') as FormControl;
  }

  get password(): FormControl {
    return this.form.get('password') as FormControl;
  }

  get remember_me(): FormControl {
    return this.form.get('remember_me') as FormControl;
  }
}
