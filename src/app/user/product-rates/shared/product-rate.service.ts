import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { TradeType } from '../../../product/shared/trade-type.enum';
import ProductRate from './product.rate.model';

@Injectable({
  providedIn: 'root',
})
export class ProductRateService {
  private readonly baseUrl = `${environment.apiUrl}/productrates`;

  constructor(private httpClient: HttpClient) {}

  saveProductRates(
    userId: number,
    productRates: ProductRate[],
    trade: TradeType
  ) {
    return this.httpClient.put(
      `${this.baseUrl}/${userId}/${trade}`,
      productRates
    );
  }

  getProductRates(userId: number) {
    return this.httpClient.get<ProductRate[]>(`${this.baseUrl}/${userId}`);
  }
}
