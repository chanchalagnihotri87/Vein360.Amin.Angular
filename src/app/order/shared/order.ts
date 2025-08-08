import Clinic from '../../container-allotment/shared/clinic.model';
import Product from '../../product/shared/product.model';
import { OrderStatus } from './order-status';

export class Order {
  constructor(
    public id: number,
    public product: Product,
    public clinic: Clinic,
    public price: number,
    public paid: boolean,
    public status: OrderStatus,
    public createdDate: Date,
    public userId: number,
    public quantity: number
  ) {}
}
