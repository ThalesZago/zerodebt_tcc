import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SideNavService {
  fullSized: BehaviorSubject<boolean>;

  constructor() {
    this.fullSized = new BehaviorSubject<boolean>(false);
  }

  toggleSize(): void {
    this.fullSized.next(!this.fullSized.value);
  }
}
