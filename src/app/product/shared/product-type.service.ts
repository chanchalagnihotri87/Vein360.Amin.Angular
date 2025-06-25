import { Injectable } from '@angular/core';
import ProductTypeListItem from './product-type-list-item.model';
import { ProductType } from './product-type.enum';

@Injectable({
  providedIn: 'root',
})
export class ProductTypeService {
  getProductTypes() {
    return [
      new ProductTypeListItem(ProductType.ClosureFast, 'Closure Fast'),
      new ProductTypeListItem(ProductType.IVUS, 'IVUS'),
      new ProductTypeListItem(ProductType.Urology, 'Urology'),
    ];
  }
}
