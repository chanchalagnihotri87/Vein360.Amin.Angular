import { Component, effect, input } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PopoverModule } from 'ngx-bootstrap/popover';
import Product from '../../product/shared/product.model';
import { ProductRateService } from './shared/product-rate.service';
import ProductRate from './shared/product.rate.model';

@Component({
  selector: 'app-product-rates',
  imports: [ReactiveFormsModule, PopoverModule],
  templateUrl: './product-rates.component.html',
})
export class ProductRatesComponent {
  userId = input.required<number>();
  products = input.required<Product[]>();
  productRates = input.required<ProductRate[]>();

  productRateForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private productRateService: ProductRateService
  ) {
    this.productRateForm = this.createProductRateForm();

    effect(() => {
      if (this.products()) {
        this.loadProductRatesArray();
      }
    });
  }

  //#endregion

  //#region  Public Methods
  sumbitForm() {
    if (this.productRateForm.valid) {
      let productRateControlArray = this.productRateForm.value.productRates;

      let filteredProductForms = productRateControlArray.filter(
        (controlsArray: any) =>
          controlsArray.sellingPrice ||
          controlsArray.buyingPrice ||
          controlsArray.payToSalesCredit ||
          controlsArray.payFromSalesCredit
      );

      var productRates = filteredProductForms.map(
        (controlsArray: any) =>
          new ProductRate(
            controlsArray.productId,
            controlsArray.sellingPrice == ''
              ? undefined
              : controlsArray.sellingPrice,
            controlsArray.buyingPrice == ''
              ? undefined
              : controlsArray.buyingPrice,
            controlsArray.payToSalesCredit,
            controlsArray.payFromSalesCredit
          )
      );

      console.log('Form Submitted', this.productRateForm.value);

      this.productRateService
        .saveProductRates(this.userId(), productRates)
        .subscribe(() => {
          console.log('Product rates saved successfully');
        });

      // Here you can handle the form submission, e.g., send it to a server
    } else {
      console.log('Form is invalid');
    }
  }

  //#endregion

  //#region  Getters
  get productRateFormControls() {
    return this.productRateForm.get('productRates') as FormArray;
  }

  //#endregion

  //#region  Private Methods

  private createProductRateForm() {
    return this.formBuilder.group({
      productRates: this.formBuilder.array([this.formBuilder.group([])]),
    });
  }

  private loadProductRatesArray() {
    this.productRateFormControls.clear();
    console.log('Product Rates:');
    console.log(this.productRates());

    this.products().map((product) => {
      const existingRate = this.productRates().find(
        (rate) => rate.productId === product.id
      );

      console.log('Existing Rate:', existingRate);

      this.productRateFormControls.push(
        this.formBuilder.group({
          productId: [product.id, Validators.required],
          productName: [product.name],
          buyingPrice: [existingRate ? existingRate.buyingPrice : ''],
          sellingPrice: [existingRate ? existingRate.sellingPrice : ''],
          payToSalesCredit: [
            existingRate ? existingRate.payToSalesCredit : false,
          ],
          payFromSalesCredit: [
            existingRate ? existingRate.payFromSalesCredit : false,
          ],
        })
      );
    });
  }

  //#endregion
}
