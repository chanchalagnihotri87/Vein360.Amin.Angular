import { OrderStatus } from './order-status';

export default class UpdateOrderRequest {
  constructor(
    public orderId: number,
    public productId: number,
    public clinicId: number,
    public price: number,
    public status: OrderStatus
  ) {}
}
