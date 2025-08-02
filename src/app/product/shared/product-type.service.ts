import { Injectable } from '@angular/core';
import ProductTypeListItem from './product-type-list-item.model';
import { ProductType } from './product-type.enum';

@Injectable({
  providedIn: 'root',
})
export class ProductTypeService {
  getProductTypes() {
    return [
      new ProductTypeListItem(ProductType.ClosureFast, 'ClosureFast'),
      new ProductTypeListItem(ProductType.IVUS, 'IVUS'),
      new ProductTypeListItem(ProductType.Urology, 'Urology'),
      new ProductTypeListItem(ProductType.Introducer, 'Introducer'),
      new ProductTypeListItem(ProductType.ProcedurePack, 'Procedure Pack'),
    ];
  }

  public getProductTypeString(cateory?: number) {
    if (!cateory) {
      return '';
    }

    if (cateory == ProductType.ProcedurePack) {
      return 'Procedure Pack';
    }
    return ProductType[cateory];
  }
}
