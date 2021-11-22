import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelectionListChange } from '@angular/material/list';
import { Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  switchMap,
} from 'rxjs/operators';
import { Product } from 'src/app/interfaces/product';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-modal-products',
  templateUrl: './modal-products.component.html',
  styleUrls: ['./modal-products.component.scss'],
})
export class ModalProductsComponent
  implements OnInit, OnDestroy, AfterViewInit {
  aProducts!: Array<Product>;
  loading = true;

  form: FormGroup;
  subscriptions$: Array<Subscription>;

  constructor(
    private productsService: ProductsService,
    private formBuilder: FormBuilder,
    private matDialogRef: MatDialogRef<ModalProductsComponent>,
  ) {
    this.form = this.formBuilder.group({
      search: [''],
      opportunity_value_discount: [null],
      opportunity_percent_discount: [null],
      discount_type: ['percent'],
      product: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
    });
    this.subscriptions$ = new Array<Subscription>();
  }

  ngOnInit(): void {
    this.subscriptions$.push(
      this.productsService.aProducts.subscribe(res => {
        this.aProducts = [...res];
      }),
    );
  }

  ngAfterViewInit(): void {
    this.subscriptions$.push(
      this.search.valueChanges
        .pipe(debounceTime(500), distinctUntilChanged())
        .pipe(
          startWith({}),
          switchMap(() => {
            this.loading = true;

            return this.productsService.getProducts(
              999,
              1,
              this.search?.value,
              'id',
              'asc',
            );
          }),
        )
        .subscribe(() => (this.loading = false)),
    );
  }

  handleProduct(event: MatSelectionListChange): void {
    this.product.setValue(
      (event.options.values().next().value as { value: Product }).value,
    );
  }

  handleSubmit(): void {
    if (
      this.form.valid &&
      (this.opportunity_percent_discount.value ||
        this.opportunity_value_discount)
    ) {
      this.matDialogRef.close({ ...this.form.value, ...this.product.value });
    }
  }

  handleClose(): void {
    this.matDialogRef.close();
  }

  ngOnDestroy(): void {
    this.subscriptions$.forEach(sub => sub.unsubscribe());
  }

  get search(): FormControl {
    return this.form.get('search') as FormControl;
  }

  get product(): FormControl {
    return this.form.get('product') as FormControl;
  }

  get discount_type(): FormControl {
    return this.form.get('discount_type') as FormControl;
  }

  get opportunity_value_discount(): FormControl {
    return this.form.get('opportunity_value_discount') as FormControl;
  }

  get opportunity_percent_discount(): FormControl {
    return this.form.get('opportunity_percent_discount') as FormControl;
  }
}
