import { Component, Input, OnInit, output } from '@angular/core';
import {
  FormBuilder,
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

@Component({
  selector: 'app-edit-product',
  imports: [ReactiveFormsModule, ValidationMessageComponent],
  templateUrl: './edit-product.component.html',
})
export class EditProductComponent implements OnInit {
  @Input({ required: true }) product?: Product;

  onSubmit = output<Product>();
  onClose = output();

  productTypes: ProductTypeListItem[] = [];

  productForm: FormGroup;

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
  submitForm() {
    if (this.productForm.valid) {
      let updatedProduct = new Product(
        this.productForm.value.name,
        this.productForm.value.type,
        this.productForm.value.description,
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

  closeModal() {
    this.onClose.emit();
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.productForm.patchValue({
        imageFile: file,
      });
    }
  }

  public downloadLabel(imageFileName: string | undefined) {
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
      description: [''],
      type: ['', Validators.required],
      price: ['', Validators.required],
      imageFile: [null],
    });
  }

  private fillProductForm(product: Product) {
    this.productForm.get('name')?.setValue(product.name);
    this.productForm.get('description')?.setValue(product.description);
    this.productForm.get('type')?.setValue(product.type);
    this.productForm.get('price')?.setValue(product.price);
  }

  private loadProductTypes() {
    this.productTypes = this.productTypeService.getProductTypes();
  }

  //#endregion
}
