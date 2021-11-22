import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'googleMaps' })
export class GoogleMapsPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(style: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      style.replace(/(width="[0-9]+"|height="[0-9]+")/g, 'class="map"'),
    );
  }
}
