import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.scss'],
})
export class ModalConfirmComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public object: any,
    private matDialogRef: MatDialogRef<ModalConfirmComponent>,
  ) {}

  handleDelete(): void {
    this.matDialogRef.close(true);
  }

  handleClose(): void {
    this.matDialogRef.close();
  }
}
