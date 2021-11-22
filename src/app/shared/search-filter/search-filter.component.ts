import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { ISearchTerms } from 'src/app/interfaces/search-terms';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss'],
})
export class SearchFilterComponent implements OnInit {
  @Input() aCampos: Array<ISearchTerms>;
  @Output() save: EventEmitter<any>;
  aCamposFiltrados: Array<ISearchTerms>;
  oForm: FormGroup;

  constructor(private oFormBuilder: FormBuilder) {
    this.aCampos = new Array<ISearchTerms>();
    this.aCamposFiltrados = new Array<ISearchTerms>();
    this.oForm = this.oFormBuilder.group({});
    this.save = new EventEmitter<any>();
  }

  ngOnInit(): void {
    this.onBuildForm();
  }

  getControls(): AbstractControl[] | null {
    return this.oForm.get('campos')
      ? (<FormArray>this.oForm.get('campos')).controls
      : null;
  }

  onSave(): void {
    this.save.emit(this.campos.value);
  }
  onReset(): void {
    this.oForm.reset();
    this.campos.reset();
  }

  private onBuildForm() {
    this.aCamposFiltrados = this.aCampos.filter((oRes: ISearchTerms) =>
      this.isField(oRes),
    );
    const aValues = this.aCamposFiltrados.map(() => new FormControl(''));
    this.oForm = this.oFormBuilder.group({
      campos: this.oFormBuilder.array(aValues),
    });
  }

  private isField(oItem: ISearchTerms) {
    return (
      oItem.type === 'text' ||
      oItem.type === 'document' ||
      oItem.type === 'map' ||
      oItem.type === 'phone'
    );
  }

  get campos(): FormArray {
    return this.oForm.get('campos') as FormArray;
  }
}
