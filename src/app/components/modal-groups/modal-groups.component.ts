import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OpportunityGroup } from 'src/app/interfaces/opportunity-group';

@Component({
  selector: 'app-modal-groups',
  templateUrl: './modal-groups.component.html',
  styleUrls: ['./modal-groups.component.scss'],
})
export class ModalOpportunitiesGroupsComponent
  implements OnInit, AfterViewInit {
  form: FormGroup;

  @ViewChild('groupInput') elementRef!: ElementRef<HTMLInputElement>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public opportunityGroup: OpportunityGroup,
    private matDialogRef: MatDialogRef<ModalOpportunitiesGroupsComponent>,
    private formBuilder: FormBuilder,
  ) {
    this.form = this.formBuilder.group({
      opportunity_group_id: [''],
      group: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.opportunityGroup) {
      this.form.setValue({
        opportunity_group_id: this.opportunityGroup.id,
        group: this.opportunityGroup.group,
      });
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.elementRef.nativeElement.focus();
    }, 500);
  }

  handleSubmit(): void {
    if (this.form.valid) {
      this.matDialogRef.close(this.form.value);
    }
  }

  handleClose(): void {
    this.matDialogRef.close();
  }

  get group(): FormControl {
    return this.form.get('group') as FormControl;
  }
}
