import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appDragAndDrop]',
})
export class DragAndDropDirective {
  @Output() fileDropped = new EventEmitter<FileList>();

  @HostBinding('style.background-color') private background = '#0000000a';
  @HostBinding('style.opacity') private opacity = '1';

  //Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(evt: Event): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#00000050';
    this.opacity = '0.8';
  }

  //Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(evt: Event): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#0000000a';
    this.opacity = '1';
  }

  //Drop listener
  @HostListener('drop', ['$event']) public ondrop(evt: DragEvent): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#0000000a';
    this.opacity = '1';
    const files = (evt.dataTransfer as DataTransfer).files;

    if (files.length > 0) {
      this.fileDropped.emit(files);
    }
  }
}
