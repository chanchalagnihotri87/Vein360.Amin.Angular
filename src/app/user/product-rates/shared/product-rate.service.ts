import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import ProductRate from './product.rate.model';

@Injectable({
  providedIn: 'root',
})
export class ProductRateService {
  private readonly baseUrl = `${environment.apiUrl}/productrates`;

  constructor(private httpClient: HttpClient) {}

  saveProductRates(userId: number, productRates: ProductRate[]) {
    return this.httpClient.put(`${this.baseUrl}/${userId}`, productRates);
  }

  getProductRates(userId: number) {
    return this.httpClient.get<ProductRate[]>(`${this.baseUrl}/${userId}`);
  }
}
