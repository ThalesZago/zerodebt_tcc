import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-documents',
  templateUrl: './modal-documents.component.html',
  styleUrls: ['./modal-documents.component.scss'],
})
export class ModalDocumentsComponent {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private matDialogRef: MatDialogRef<ModalDocumentsComponent>,
  ) {
    this.form = this.formBuilder.group({
      id: [''],
      url: ['', [Validators.required]],
      file_path: ['', [Validators.required]],
      path_name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      description: [''],
      opportunity_document_types_id: ['', [Validators.required]],
    });
  }

  handleDocumentUpload(upload: FileList | Event): void {
    let files: FileList;

    if (upload instanceof Event) {
      files = (upload.target as HTMLInputElement).files as FileList;
    } else {
      files = upload;
    }

    const reader = new FileReader();

    if (files.length) {
      // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
      if (files[0].type.match(/(image|application\/pdf)\/*/) !== null) {
        reader.readAsDataURL(files[0]);

        reader.onload = () => {
          this.form.patchValue({
            id: null,
            url: reader.result as string,
            file_path: `data:${files[0].type};base64,${
              (reader.result as string).split(',')[1]
            }`,
            path_name: files[0].name,
            type: files[0].type,
          });
        };
      }
    }
  }

  handleDocumentDelete(): void {
    this.form.patchValue({ url: '', file_path: '', path_name: '', type: '' });
  }

  handleSubmit(): void {
    if (this.form.valid) {
      this.matDialogRef.close(this.form.value);
    }
  }

  handleClose(): void {
    this.matDialogRef.close();
  }

  get path_name(): FormControl {
    return this.form.get('path_name') as FormControl;
  }
}
