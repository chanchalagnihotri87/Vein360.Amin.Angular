import { Component, Input, OnInit, output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FileDownloadService } from '../../shared/services/file-download.service';
import { ValidationMessageComponent } from '../../shared/validation-message/validation-message.component';
import ProductTypeListItem from '../shared/product-type-list-item.model';
import { ProductTypeService } from '../shared/product-type.service';
import Product from '../shared/product.model';
import { ProductService } from '../shared/product.service';
import { TradeType } from '../shared/trade-type.enum';

@Component({
  selector: 'app-edit-product',
  imports: [ReactiveFormsModule, ValidationMessageComponent],
  templateUrl: './edit-product.component.html',
})
export class EditProductComponent implements OnInit {
  @Input({ required: true }) product?: Product;

  public onSubmit = output<Product>();
  public onClose = output();

  protected productTypes: ProductTypeListItem[] = [];
  protected productForm: FormGroup;

  get TradeType() {
    return TradeType;
  }

  constructor(
    private formBuilder: FormBuilder,
    private productTypeService: ProductTypeService,
    private productService: ProductService,
    private fileDownloadService: FileDownloadService
  ) {
    this.productForm = this.createProductForm();
    this.loadProductTypes();
  }

  ngOnInit(): void {
    this.fillProductForm(this.product!);
  }

  //#region Public Methods
  protected submitForm() {
    if (this.productForm.valid) {
      let updatedProduct = new Product(
        this.productForm.value.name,
        this.productForm.value.type,
        this.productForm.value.vein360ProductId,
        this.productForm.value.trade,
        this.productForm.value.price
      );

      if (this.productForm.value.imageFile) {
        updatedProduct.imageFile = this.productForm.value.imageFile;
      }

      updatedProduct.id = this.product!.id;

      this.onSubmit.emit(updatedProduct);
      this.onClose.emit();
    }
  }

  protected closeModal() {
    this.onClose.emit();
  }

  protected onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.productForm.patchValue({
        imageFile: file,
      });
    }
  }

  protected downloadLabel(imageFileName: string | undefined) {
    if (imageFileName) {
      this.productService
        .getImage(imageFileName)
        .subscribe((labelData: Blob) => {
          this.fileDownloadService.downloadFile(labelData, imageFileName);
        });
    }
  }
  //#endregion

  //#region  Private Methods

  private createProductForm() {
    return this.formBuilder.group({
      name: ['', Validators.required],
      vein360ProductId: ['', [Validators.required, Validators.maxLength(20)]],
      type: ['', Validators.required],
      price: [''],
      trade: ['', Validators.required],
      imageFile: [null],
    });
  }

  get priceFormControl() {
    return this.productForm.get('price') as FormControl;
  }

  get isSaleProduct() {
    return this.productForm.value.trade == TradeType.Sale;
  }

  protected updatePriceValidations() {
    if (this.isSaleProduct) {
      this.priceFormControl.setValidators([Validators.required]);
      this.priceFormControl.enable();
    } else {
      this.priceFormControl.clearValidators();
      this.priceFormControl.disable();
    }
    this.priceFormControl.updateValueAndValidity();
  }

  private fillProductForm(product: Product) {
    this.productForm.get('name')?.setValue(product.name);
    this.productForm
      .get('vein360ProductId')
      ?.setValue(product.vein360ProductId);
    this.productForm.get('type')?.setValue(product.type);
    this.productForm.get('price')?.setValue(product.price);
    this.productForm.get('trade')?.setValue(product.trade);

    this.updatePriceValidations();
  }

  private loadProductTypes() {
    this.productTypes = this.productTypeService.getProductTypes();
  }

  //#endregion
}
