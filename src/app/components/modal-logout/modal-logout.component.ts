/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-modal-logout',
  templateUrl: './modal-logout.component.html',
  styleUrls: ['./modal-logout.component.scss'],
})
export class ModalLogoutComponent {
  constructor(
    private matDialogRef: MatDialogRef<ModalConfirmComponent>,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public object: { email: string; password: string },
  ) {}

  handleLogout(): void {
    this.matDialogRef.close(true);

    this.authService
      .forceLogout(this.object.email, this.object.password)
      .subscribe();
  }

  handleClose(): void {
    this.matDialogRef.close();
  }
}
