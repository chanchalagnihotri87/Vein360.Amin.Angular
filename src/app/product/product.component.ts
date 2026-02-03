import { Component } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BreadcrumbService } from '../breadcrumb/shared/breadcrumb.service';
import { ConfirmationMessageComponent } from '../shared/confirmation-modal/confirmation-modal.component';
import { MessageDisplayService } from '../shared/message-display/message-display.service';
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
  protected products: Product[] = [];

  get ProductType() {
    return ProductType;
  }

  private productModalRef?: BsModalRef;
  private confirmationModalRef?: BsModalRef;

  constructor(
    private readonly productService: ProductService,
    private readonly modalService: BsModalService,
    private readonly breadcrumbService: BreadcrumbService,
    private readonly productTypeService: ProductTypeService,
    private readonly msgDisplayService: MessageDisplayService,
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
      configuartions,
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
      configuartions,
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
      initialState,
    );

    this.confirmationModalRef.content.onYes.subscribe(() => {
      this.productService.deleteProduct(productId).subscribe(() => {
        this.loadProducts(() =>
          this.msgDisplayService.showSuccessMessage(
            'Product deleted successfully.',
          ),
        );
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

  //#region  Private Methods
  private loadProducts(callback?: () => void) {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
      if (callback) {
        callback();
      }
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
      this.loadProducts(() =>
        this.msgDisplayService.showSuccessMessage(
          'Product added successfully.',
        ),
      );
    });
  }

  private closeModal() {
    if (this.productModalRef) {
      this.productModalRef.hide();
    }
  }

  private handleUpdateProduct(product: Product) {
    this.productService.updateProduct(product).subscribe(() => {
      this.loadProducts(() =>
        this.msgDisplayService.showSuccessMessage(
          'Product updated successfully.',
        ),
      );
    });
  }

  //#endregion
}
