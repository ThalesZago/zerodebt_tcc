import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { finalize, take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-modal-recovery',
  templateUrl: './modal-recovery.component.html',
  styleUrls: ['./modal-recovery.component.scss'],
})
export class ModalRecoveryComponent {
  emailForm: FormGroup;
  pinForm: FormGroup;
  passwordForm: FormGroup;

  hidePassword: boolean;
  hidePasswordConfirm: boolean;

  currentStep: number;

  loading: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private matDialogRef: MatDialogRef<ModalRecoveryComponent>,
  ) {
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.pinForm = this.formBuilder.group({
      pin: ['', [Validators.required]],
    });

    this.passwordForm = this.formBuilder.group(
      {
        password: ['', [Validators.required]],
        password_confirm: ['', [Validators.required]],
      },
      { validators: this.handleSamePasswords('password', 'password_confirm') },
    );

    this.hidePassword = true;
    this.hidePasswordConfirm = true;

    this.currentStep = 0;

    this.loading = false;
  }

  handleNextStep(stepper: MatStepper): void {
    switch (this.currentStep) {
      case 0:
        if (this.email?.valid) {
          this.loading = true;

          this.authService
            .revokePassword(this.email?.value)
            .pipe(
              take(1),
              finalize(() => (this.loading = false)),
            )
            .subscribe(() => {
              stepper.next();
              this.currentStep++;
            });
        }
        break;
      case 1:
        if (this.pin?.valid) {
          this.loading = true;

          this.authService
            .verifyPin(this.email?.value, this.pin?.value)
            .pipe(
              take(1),
              finalize(() => (this.loading = false)),
            )
            .subscribe(() => {
              stepper.next();
              this.currentStep++;
            });
        }
        break;
      case 2:
        if (this.password?.valid && this.password_confirm?.valid) {
          this.loading = true;

          this.authService
            .recoveryPassword(
              this.email?.value,
              this.pin?.value,
              this.password?.value,
              this.password_confirm?.value,
            )
            .pipe(
              take(1),
              finalize(() => (this.loading = false)),
            )
            .subscribe(() => this.matDialogRef.close());
        }
        break;
    }
  }

  handleSamePasswords(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup): void => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (
        matchingControl.errors &&
        !matchingControl.errors.confirmedValidator
      ) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ notSame: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  get email(): FormControl {
    return this.emailForm.get('email') as FormControl;
  }

  get pin(): FormControl {
    return this.pinForm.get('pin') as FormControl;
  }

  get password(): FormControl {
    return this.passwordForm.get('password') as FormControl;
  }

  get password_confirm(): FormControl {
    return this.passwordForm.get('password_confirm') as FormControl;
  }
}
