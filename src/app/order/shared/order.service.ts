import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Order } from './order';
import UpdateOrderRequest from './update-order-request';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private baseUrl = `${environment.apiUrl}/orders`;
  constructor(private httpClient: HttpClient) {}

  public getOrders() {
    return this.httpClient.get<Order[]>(this.baseUrl);
  }

  public getOrder(orderId: number) {
    return this.httpClient.get<Order>(`${this.baseUrl}/${orderId}`);
  }

  public updateOrder(updatedOrder: UpdateOrderRequest) {
    return this.httpClient.put<Order>(`${this.baseUrl}`, updatedOrder);
  }

  public deleteOrder(orderId: number) {
    return this.httpClient.delete(`${this.baseUrl}/${orderId}`);
  }
}
