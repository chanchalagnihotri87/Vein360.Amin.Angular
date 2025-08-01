import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import Product from './product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly baseUrl = `${environment.apiUrl}/products`;

  constructor(private httpClient: HttpClient) {}

  getProductsAsListItems(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.baseUrl}/listitems`);
  }

  getProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(this.baseUrl);
  }

  addProduct(product: Product) {
    const formData = this.createFormData(product);

    return this.httpClient.post(this.baseUrl, formData);
  }

  updateProduct(product: Product) {
    const formData = this.createFormData(product);
    formData.append('id', product.id.toString());

    return this.httpClient.put(this.baseUrl, formData);
  }

  deleteProduct(productId: number) {
    return this.httpClient.delete(`${this.baseUrl}/${productId}`);
  }

  getImage(imgFileName: string) {
    return this.httpClient.get(`${this.baseUrl}/image/${imgFileName}`, {
      responseType: 'blob',
    });
  }

  private createFormData(product: Product) {
    debugger;
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('type', product.type.toString());
    formData.append('vein360ProductId', product.vein360ProductId ?? '');
    formData.append('trade', product.trade.toString());
    if (product.imageFile) {
      formData.append('imageFile', product.imageFile!);
    }

    formData.append('price', product.price!.toString());

    return formData;
  }
}
