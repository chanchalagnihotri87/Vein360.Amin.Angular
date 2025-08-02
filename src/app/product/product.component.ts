import { Component } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BreadcrumbService } from '../breadcrumb/shared/breadcrumb.service';
import { ConfirmationMessageComponent } from '../shared/confirmation-modal/confirmation-modal.component';
import { AddProductComponent } from './add-product/add-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ProductType } from './shared/product-type.enum';
import { ProductTypeService } from './shared/product-type.service';
import Product from './shared/product.model';
import { ProductService } from './shared/product.service';
@Component({
  selector: 'app-product',
  imports: [],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent {
  products: Product[] = [];

  private productModalRef?: BsModalRef;
  private confirmationModalRef?: BsModalRef;

  constructor(
    private readonly productService: ProductService,
    private readonly modalService: BsModalService,
    private readonly breadcrumbService: BreadcrumbService,
    private readonly productTypeService: ProductTypeService
  ) {}

  ngOnInit(): void {
    this.setBreadcrumb();
    this.loadProducts();
  }

  //#region Public Methods
  showAddProductModal() {
    const configuartions: ModalOptions = {
      initialState: {},
      class: 'modal-xl',
    };

    this.productModalRef = this.modalService.show(
      AddProductComponent,
      configuartions
    );

    this.productModalRef.content.onSubmit.subscribe((product: Product) => {
      this.handleAddProduct(product);
      this.closeModal();
    });

    this.productModalRef.content.onClose.subscribe(() => {
      this.closeModal();
    });
  }

  showEditProductModal(product: Product) {
    const configuartions: ModalOptions = {
      initialState: {
        product: product,
      },
      class: 'modal-xl',
    };

    this.productModalRef = this.modalService.show(
      EditProductComponent,
      configuartions
    );

    this.productModalRef.content.onSubmit.subscribe((product: Product) => {
      this.handleUpdateProduct(product);
      this.closeModal();
    });

    this.productModalRef.content.onClose.subscribe(() => {
      this.closeModal();
    });
  }

  handleDeleteProduct(productId: number) {
    const initialState: ModalOptions = {
      initialState: {
        message: 'Are you sure you want to delete this product?',
      },
      class: 'modal-md',
    };
    this.confirmationModalRef = this.modalService.show(
      ConfirmationMessageComponent,
      initialState
    );

    this.confirmationModalRef.content.onYes.subscribe(() => {
      this.productService.deleteProduct(productId).subscribe(() => {
        this.loadProducts();
      });

      this.closeConfirmationModal();
    });

    this.confirmationModalRef.content.onNo.subscribe(() => {
      this.closeConfirmationModal();
    });
  }

  getProductTypeString(type: ProductType) {
    return this.productTypeService.getProductTypeString(type);
  }

  //#endregion

  //#region Get Properties

  get ProductType() {
    return ProductType;
  }

  //#endregion

  //#region  Private Methods
  private loadProducts() {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
    });
  }

  private setBreadcrumb() {
    this.breadcrumbService.breadcrumbs.set([{ label: 'Products', path: '' }]);
  }

  private closeConfirmationModal() {
    if (this.confirmationModalRef) {
      this.confirmationModalRef.hide();
    }
  }

  private handleAddProduct(product: Product) {
    this.productService.addProduct(product).subscribe(() => {
      this.loadProducts();
    });
  }

  private closeModal() {
    if (this.productModalRef) {
      this.productModalRef.hide();
    }
  }

  private handleUpdateProduct(product: Product) {
    this.productService.updateProduct(product).subscribe(() => {
      this.loadProducts();
    });
  }

  //#endregion
}
