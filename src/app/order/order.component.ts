import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ProductService } from '../product/shared/product.service';
import { ConfirmationMessageComponent } from '../shared/confirmation-modal/confirmation-modal.component';
import { ListItem } from '../shared/models/list-item';
import { EditOrderComponent } from './edit-order/edit-order.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { Order } from './shared/order';
import { OrderStatus } from './shared/order-status';
import { OrderService } from './shared/order.service';
import UpdateOrderRequest from './shared/update-order-request';

@Component({
  selector: 'app-order',
  imports: [DatePipe],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent implements OnInit {
  protected orders: Order[] = [];

  private products: ListItem[] = [];
  private orderDetailModal?: BsModalRef;
  private editOrderModal?: BsModalRef;
  private confirmationModal?: BsModalRef;

  constructor(
    private readonly orderService: OrderService,
    private readonly modalService: BsModalService,
    private readonly productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadClinics();
    this.loadProducts();
  }

  private loadClinics() {
    this.orderService.getOrders().subscribe((orders) => {
      this.orders = orders;
    });
  }

  private loadProducts() {
    this.productService.getProductsAsListItems().subscribe((products) => {
      this.products = products;
    });
  }

  protected getOrderStatusDescription(orderStatus: OrderStatus) {
    return OrderStatus[orderStatus];
  }

  protected get OrderStatus() {
    return OrderStatus;
  }

  //#region  Order Detail
  protected orderDetail(orderId: number) {
    this.orderService.getOrder(orderId).subscribe((order) => {
      this.showOrderDetailModal(order);
    });
  }

  private showOrderDetailModal(order: Order) {
    let configurations: ModalOptions = {
      initialState: {
        order: order,
      },
      class: 'modal-xl',
    };
    this.orderDetailModal = this.modalService.show(
      OrderDetailComponent,
      configurations
    );

    this.orderDetailModal.content.onClose.subscribe(() => {
      this.orderDetailModal?.hide();
    });
  }

  //#endregion

  //#region Edit Order
  protected editOrder(orderId: number) {
    this.orderService.getOrder(orderId).subscribe((order) => {
      this.showEditOrderModal(order);
    });
  }

  private showEditOrderModal(order: Order) {
    let options: ModalOptions = {
      initialState: {
        order: order,
        products: this.products,
      },
      backdrop: 'static',
      class: 'modal-lg',
    };

    this.editOrderModal = this.modalService.show(EditOrderComponent, options);

    this.editOrderModal.content.onSubmit.subscribe(
      (updatedOrderRequest: UpdateOrderRequest) => {
        this.orderService
          .updateOrder(updatedOrderRequest)
          .subscribe((updatedOrder: Order) => {
            debugger;
            let orderIndex = this.orders.findIndex((x) => x.id == order.id);
            this.orders[orderIndex] = updatedOrder;
            this.closeEditOrderModal();
          });
      }
    );

    this.editOrderModal.content.onClose.subscribe(() => {
      this.closeEditOrderModal();
    });
  }

  private closeEditOrderModal() {
    this.editOrderModal?.hide();
  }

  //#endregion

  //#region Delete
  protected deleteOrder(orderId: number) {
    let initialState: ModalOptions = {
      initialState: {
        message: 'Are you sure you want to delete this order?',
      },
      class: 'modal-md',
    };

    this.confirmationModal = this.modalService.show(
      ConfirmationMessageComponent,
      initialState
    );

    this.confirmationModal.content.onYes.subscribe(() => {
      this.orderService.deleteOrder(orderId).subscribe(() => {
        let orderIndex = this.orders.findIndex((x) => x.id == orderId);
        this.orders.splice(orderIndex, 1);

        this.closeConfirmationModal();
      });
    });

    this.confirmationModal.content.onNo.submitOrder(() => {
      this.closeConfirmationModal();
    });
  }

  private closeConfirmationModal() {
    this.confirmationModal?.hide();
  }
  //#endregion
}
