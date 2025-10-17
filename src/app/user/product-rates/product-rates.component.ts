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
import { TradeType } from '../../product/shared/trade-type.enum';
import { ProductRateService } from './shared/product-rate.service';
import ProductRate from './shared/product.rate.model';

@Component({
  selector: 'app-product-rates',
  imports: [ReactiveFormsModule, PopoverModule],
  templateUrl: './product-rates.component.html',
})
export class ProductRatesComponent {
  public userId = input.required<number>();
  public products = input.required<Product[]>();
  public productRates = input.required<ProductRate[]>();
  public trade = input.required<TradeType>();

  protected productRateForm: FormGroup;

  protected get productRateFormControls() {
    return this.productRateForm.get('productRates') as FormArray;
  }

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

  //#region  Public Methods
  protected sumbitForm() {
    if (this.productRateForm.valid) {
      let productRateControlArray = this.productRateForm.value.productRates;

      let filteredProductForms = productRateControlArray.filter(
        (controlsArray: any) =>
          controlsArray.price || controlsArray.useSalesCredit
      );

      var productRates = filteredProductForms.map(
        (controlsArray: any) =>
          new ProductRate(
            controlsArray.productId,
            controlsArray.price == '' ? undefined : controlsArray.price,
            controlsArray.useSalesCredit
          )
      );

      console.log('Form Submitted', productRates);

      this.productRateService
        .saveProductRates(this.userId(), productRates, this.trade())
        .subscribe(() => {
          console.log('Product rates saved successfully');
        });

      // Here you can handle the form submission, e.g., send it to a server
    } else {
      console.log('Form is invalid');
    }
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

      this.productRateFormControls.push(
        this.formBuilder.group({
          productId: [product.id, Validators.required],
          productName: [product.name],
          price: [existingRate ? existingRate.price : ''],
          useSalesCredit: [existingRate ? existingRate.useSalesCredit : false],
        })
      );
    });
  }

  //#endregion
}
