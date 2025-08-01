import { Component, OnInit, output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { PackageType } from '../../shared/enums/package-type.enum';
import { ValidationMessageComponent } from '../../shared/validation-message/validation-message.component';
import ProductTypeListItem from '../shared/product-type-list-item.model';
import { ProductTypeService } from '../shared/product-type.service';
import Product from '../shared/product.model';
import { TradeType } from '../shared/trade-type.enum';

@Component({
  selector: 'app-add',
  imports: [ReactiveFormsModule, ValidationMessageComponent],
  templateUrl: './add-product.component.html',
})
export class AddProductComponent implements OnInit {
  public onSubmit = output<Product>();
  public onClose = output();

  public productForm: FormGroup;
  public productTypes: ProductTypeListItem[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private productTypeService: ProductTypeService
  ) {
    this.productForm = this.createProductForm();
  }

  ngOnInit(): void {
    this.productTypes = this.productTypeService.getProductTypes();
  }

  //#region  Public Methods

  public submitForm() {
    if (this.productForm.valid) {
      let newProduct = new Product(
        this.productForm.value.name,
        this.productForm.value.type,
        this.productForm.value.vein360ProductId,
        this.productForm.value.trade,
        this.productForm.value.price
      );

      newProduct.imageFile = this.productForm.value.imageFile;

      this.onSubmit.emit(newProduct);
      this.onClose.emit();
    }
  }

  public containerTypeChanged() {
    (this.productForm.get('container') as FormControl)?.setValue(''); // Set
  }

  public closeModal() {
    if (this.onClose) {
      this.onClose.emit();
    }
  }

  public onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.productForm.patchValue({
        imageFile: file,
      });
    }
  }

  //#endregion

  //#region Get Properties

  get ContainerType() {
    return PackageType;
  }

  get TradeType() {
    return TradeType;
  }

  //#endregion

  //#region  Private Methods

  private createProductForm() {
    return this.formBuilder.group({
      name: ['', Validators.required],
      vein360ProductId: ['', [Validators.required, Validators.maxLength(11)]],
      type: ['', Validators.required],
      price: ['', Validators.required],
      trade: ['', Validators.required],
      imageFile: [null, Validators.required],
    });
  }

  //#endregion
}
