import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-image',
  templateUrl: './modal-image.component.html',
  styleUrls: ['./modal-image.component.scss'],
})
export class ModalImageComponent {
  image: string;

  constructor(@Inject(MAT_DIALOG_DATA) public img: string) {
    this.image = img;
  }
}
