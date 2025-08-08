import { Component, Input, output } from '@angular/core';
import { ProductType } from '../../product/shared/product-type.enum';
import { AddressComponent } from '../../shared/address/address.component';
import { ListItem } from '../../shared/models/list-item';
import { Order } from '../shared/order';
import { OrderStatus } from '../shared/order-status';

@Component({
  selector: 'app-order-detail',
  imports: [AddressComponent],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss',
})
export class OrderDetailComponent {
  @Input({ required: true }) order?: Order;
  @Input({ required: true }) clinics: ListItem[] = [];

  onClose = output();

  protected getProductTypeDescription(productType?: ProductType) {
    console.log('Product Type:');
    console.log(productType);
    if (!productType) {
      return '';
    }

    return ProductType[productType];
  }

  protected closeModal() {
    this.onClose.emit();
  }

  getOrderStatusDescription(orderStatus?: OrderStatus) {
    if (!orderStatus) {
      return '';
    }
    return OrderStatus[orderStatus];
  }
}
